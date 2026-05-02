import fs from 'node:fs';
import path from 'node:path';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const requestSchema = z.object({
  guestName: z.string().min(1, 'Guest name is required.'),
  guestEmail: z.string().email('A valid guest email is required.'),
  starter: z.string().min(1),
  main: z.string().min(1),
  dessert: z.string().min(1),
  allergies: z.string().optional().default(''),
  activity: z.string().min(1),
  submissionType: z.enum(['initial', 'food_update', 'activity_update']).default('initial'),
});

type WeddingSelection = z.infer<typeof requestSchema>;

function formatSubmissionType(type: WeddingSelection['submissionType']) {
  return type
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildEmailHtml(data: WeddingSelection) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #1f2937;">
  <h1 style="margin-bottom: 8px;">New Wedding Guest Selections</h1>
  <p style="margin-top: 0; color: #6b7280;">Jon & Tao wedding website submission</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
    <tr><td style="padding: 10px 0; font-weight: 600;">Guest Name</td><td style="padding: 10px 0;">${data.guestName}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Guest Email</td><td style="padding: 10px 0;">${data.guestEmail}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Submission Type</td><td style="padding: 10px 0;">${formatSubmissionType(data.submissionType)}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Nov 24 Activity</td><td style="padding: 10px 0;">${data.activity}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Starter</td><td style="padding: 10px 0;">${data.starter}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Main</td><td style="padding: 10px 0;">${data.main}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Dessert</td><td style="padding: 10px 0;">${data.dessert}</td></tr>
    <tr><td style="padding: 10px 0; font-weight: 600;">Allergies / Dietary Notes</td><td style="padding: 10px 0;">${data.allergies || 'None shared'}</td></tr>
  </table>
</body>
</html>
  `.trim();
}

async function syncSelectionsToGoogleSheet(data: WeddingSelection) {
  const webhookUrl = readEnvFallback('WEDDING_SELECTIONS_SHEET_WEBHOOK_URL');
  if (!webhookUrl) {
    return { enabled: false };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      submissionType: formatSubmissionType(data.submissionType),
      submittedAt: new Date().toISOString(),
    }),
  });

  const responseText = await response.text().catch(() => '');

  if (!response.ok) {
    const message = responseText;
    throw new Error(message || `Google Sheet sync failed with ${response.status}`);
  }

  if (!responseText) {
    return { enabled: true };
  }

  let result: { ok?: boolean; error?: string; row?: number };
  try {
    result = JSON.parse(responseText) as { ok?: boolean; error?: string; row?: number };
  } catch {
    throw new Error(`Google Sheet sync returned an unexpected response: ${responseText.slice(0, 120)}`);
  }

  if (result.ok === false) {
    throw new Error(result.error || 'Google Sheet sync failed.');
  }

  return { enabled: true, row: result.row };
}

function readEnvFallback(key: string): string | undefined {
  const direct = process.env[key];
  if (direct) {
    return direct;
  }

  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '..', '.env'),
    path.join(process.cwd(), '..', '..', '.env'),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) {
      continue;
    }

    const contents = fs.readFileSync(candidate, 'utf8');
    const match = contents.match(new RegExp(`^\\s*${key}\\s*=\\s*(.*)$`, 'm'));
    if (!match?.[1]) {
      continue;
    }

    return match[1].trim().replace(/^['"]|['"]$/g, '');
  }

  return undefined;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid request.' }, { status: 400 });
  }

  const recipient = readEnvFallback('WEDDING_SELECTIONS_TO_EMAIL');
  if (!recipient) {
    return NextResponse.json(
      { error: 'WEDDING_SELECTIONS_TO_EMAIL is not configured.' },
      { status: 500 },
    );
  }

  const mailFrom = readEnvFallback('MAIL_FROM') || 'onboarding@resend.dev';
  let sheetSync: { enabled: boolean; error?: string } = { enabled: false };

  try {
    sheetSync = await syncSelectionsToGoogleSheet(parsed.data);
  } catch (error) {
    sheetSync = {
      enabled: true,
      error: error instanceof Error ? error.message : 'Unknown Google Sheet sync error',
    };
    console.error('[Wedding selections] Google Sheet sync failed:', sheetSync.error);
  }

  if (process.env.NODE_ENV !== 'production' || readEnvFallback('RESEND_DRY_RUN') === '1') {
    console.log('[DEV] Wedding selections submission:');
    console.log(JSON.stringify({ to: recipient, from: mailFrom, sheetSync, ...parsed.data }, null, 2));
    return NextResponse.json({ ok: true, dev: true, sheetSync });
  }

  const resendApiKey = readEnvFallback('RESEND_API_KEY');
  if (!resendApiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not configured.' }, { status: 500 });
  }

  try {
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: mailFrom,
      to: recipient,
      replyTo: parsed.data.guestEmail,
      subject: `Wedding selections from ${parsed.data.guestName}`,
      html: buildEmailHtml(parsed.data),
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sheetSync });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
