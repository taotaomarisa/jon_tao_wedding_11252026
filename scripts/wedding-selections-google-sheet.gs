const SPREADSHEET_ID = '14-a2Dsf6iBwl0fbzj_JJPzw2V_g0ZY3SqAV0aUl1gUg';
const SHEET_GID = 1732892122;
const HEADERS = [
  'Last Updated',
  'Guest Name',
  'Guest Email',
  'Nov 24 Activity',
  'Starter',
  'Main',
  'Dessert',
  'Allergies / Dietary Notes',
  'Submission Type',
];

function getWeddingSelectionsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets().find((candidate) => candidate.getSheetId() === SHEET_GID);

  if (!sheet) {
    throw new Error(`Sheet tab with gid ${SHEET_GID} was not found.`);
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => firstRow[index] === header);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const guestEmail = String(payload.guestEmail || '')
      .trim()
      .toLowerCase();

    if (!guestEmail) {
      throw new Error('guestEmail is required.');
    }

    const sheet = getWeddingSelectionsSheet();
    const lastRow = sheet.getLastRow();
    const existingEmails =
      lastRow > 1
        ? sheet
            .getRange(2, 3, lastRow - 1, 1)
            .getValues()
            .flat()
        : [];
    const existingIndex = existingEmails.findIndex(
      (email) => String(email).trim().toLowerCase() === guestEmail,
    );
    const targetRow = existingIndex >= 0 ? existingIndex + 2 : lastRow + 1;

    sheet
      .getRange(targetRow, 1, 1, HEADERS.length)
      .setValues([
        [
          payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
          payload.guestName || '',
          payload.guestEmail || '',
          payload.activity || '',
          payload.starter || '',
          payload.main || '',
          payload.dessert || '',
          payload.allergies || '',
          payload.submissionType || '',
        ],
      ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, row: targetRow }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: error.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
