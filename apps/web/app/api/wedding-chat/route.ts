import { getModel, validateProviderModel } from '@acme/ai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ),
});

const weddingSystemPrompt = `
You are an elegant but warm wedding concierge for Jon and Tao's wedding website.

Wedding facts:
- Couple: Jon and Tao
- Venue: Wymara Villa, Turks and Caicos
- Welcome party: beach BBQ on November 23, 2026
- Activity day: November 24, 2026
- Wedding date: November 25, 2026

Tone:
- Be concise, polished, and friendly.
- Answer like a helpful host.
- If the site does not yet include a confirmed detail, say that gracefully instead of inventing.

What guests can ask about:
- Weekend itinerary
- Beach BBQ menu
- Canapes after the ceremony
- Reception dinner choices
- Nov 24 activity choices
- Accommodation guidance
- Turks and Caicos explore ideas

Known menu details:
Beach BBQ salad table:
- House baked rolls and butter
- Tortillas
- Potato salad
- Green salad with ranch dressing
- Island slaw
- Chef's selection of sushi

Beach BBQ hot table:
- Peas and rice
- Mac and cheese
- Smoked jerk chicken
- Blackened mahi mahi
- Mini eye fillet
- 24 hour smoked beef brisket with BBQ sauce

Beach BBQ dessert:
- Pastry chef's selection of cake slices

Canapes:
- Vegetable spring rolls
- Arancini with serrano ham and truffle
- Sushi rolls and nigiri
- BBQ octopus skewers
- Smoked salmon rillettes tostada
- Conch ceviche with mango
- Panko prawns with tartare
- Crackling pork belly with apple remoulade

Reception starters:
- Three Taste of the Sea
- Mushroom risotto with grana Padano and truffle

Reception mains:
- Char-grilled beef tenderloin with garlic butter, truffle mashed potatoes, asparagus, and red wine jus
- Blackened local grouper fillet with Caribbean lime and mango salsa plus local rice and peas
- Vegetarian breaded cauliflower steak with coconut rice, spiced black bean salsa, and curry yogurt sauce

Reception desserts:
- Caribbean key lime cheesecake
- Deconstructed Banoffee Pie

Extra note:
- Lobster is a seasonal add-on for the beef tenderloin option at $25 per person.

Current website framing:
- The Our Story and accommodation sections are currently styled content blocks and can be expanded later with more specific couple details.
- Activity choices shown on the website are Catamaran + Reef Swim, Spa Morning + Pool Cabana, and Island Explorer Afternoon.
- Explore suggestions currently shown are Grace Bay, Sunset Cruise, and Local Flavors.
`;

function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };
}

function buildFallbackText(question: string) {
  const message = question.toLowerCase();

  if (message.includes('nov 24') || message.includes('activity')) {
    return 'On November 24, guests can choose between Catamaran + Reef Swim, Spa Morning + Pool Cabana, or Island Explorer Afternoon. The website is set up so guests can pick the pace that fits them best.';
  }

  if (message.includes('bbq') || message.includes('welcome') || message.includes('menu')) {
    return 'The welcome party beach BBQ includes salad table favorites like island slaw and sushi, hot dishes including jerk chicken, mahi mahi, mini eye fillet, and smoked brisket, plus pastry chef cake slices for dessert.';
  }

  if (message.includes('vegetarian')) {
    return 'The main vegetarian reception option is the breaded cauliflower steak with coconut rice, spiced black bean salsa, and curry yogurt sauce. There is also a mushroom risotto starter.';
  }

  if (message.includes('stay') || message.includes('hotel') || message.includes('accommodation')) {
    return 'The site currently highlights Wymara Villa as the weekend anchor and suggests staying nearby for convenience. If you share your preferred room block or hotel plan, that section can be made much more specific.';
  }

  if (message.includes('explore') || message.includes('turks') || message.includes('caicos')) {
    return 'The Explore section currently points guests toward Grace Bay, sunset cruises, and local flavors around Turks and Caicos. It is meant to help guests turn the wedding into a full island getaway.';
  }

  if (message.includes('when') || message.includes('schedule') || message.includes('itinerary')) {
    return 'The weekend schedule is: beach BBQ welcome party on November 23, 2026, choose-your-own activity day on November 24, 2026, and the wedding plus reception dinner on November 25, 2026 at Wymara Villa.';
  }

  return 'I can help with the wedding weekend schedule, menu options, activities, accommodation ideas, and Turks and Caicos recommendations. Try asking about the beach BBQ, reception dinner choices, or what happens on November 24.';
}

function createFallbackStream(question: string) {
  const encoder = new TextEncoder();
  const answer = buildFallbackText(question);

  const stream = new ReadableStream({
    async start(controller) {
      const chunks = answer.match(/.{1,28}(\s|$)/g) ?? [answer];

      for (const chunk of chunks) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'text', text: chunk })}\n\n`),
        );
        await new Promise((resolve) => setTimeout(resolve, 35));
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validated = validateProviderModel(undefined, undefined);
  const lastQuestion = parsed.data.messages[parsed.data.messages.length - 1]?.content ?? '';

  if (!validated) {
    return createFallbackStream(lastQuestion);
  }

  const model = getModel(validated.provider, validated.model) as
    | Parameters<typeof streamText>[0]['model']
    | null;

  if (!model) {
    return createFallbackStream(lastQuestion);
  }

  const result = streamText({
    model,
    system: weddingSystemPrompt,
    messages: parsed.data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const part of result.fullStream) {
          if (part.type === 'text-delta') {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'text', text: part.text })}\n\n`,
              ),
            );
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'The wedding concierge ran into an error.';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders() });
}
