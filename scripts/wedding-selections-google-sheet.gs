const SPREADSHEET_ID = '14-a2Dsf6iBwl0fbzj_JJPzw2V_g0ZY3SqAV0aUl1gUg';
const SHEET_GID = 1732892122;
const HEADERS = [
  'Guest Name',
  'Guest Email',
  'RSVP',
  'Activity',
  'Meal Type',
  'Starter',
  'Main',
  'Dessert',
  'Allergies',
  'Kids Food Request',
  'Last Updated',
];

function cleanActivityLabel(value) {
  const labels = {
    'Not attending': 'Not Attending',
    'Luxurious Sunset Sail': 'Sunset Cruise',
    'Sunset Cruise': 'Sunset Cruise',
    'Ocean Horseback Riding': 'Horseback Riding',
  };

  return labels[value] || value || '';
}

function cleanFoodLabel(value) {
  const labels = {
    'Three Taste of the Sea': 'Taste of the Sea',
    'Mushroom risotto with grana Padano & truffle': 'Mushroom Risotto',
    'Char-grilled beef tenderloin with Lobster': 'Beef Tenderloin + Lobster',
    'Blackened local grouper fillet': 'Grouper Fillet',
    'Vegetarian breaded cauliflower steak': 'Cauliflower Steak',
    'Caribbean key lime cheesecake': 'Lime Cheesecake',
    'Deconstructed Banoffee Pie': 'Banoffee Pie',
  };

  return labels[value] || value || '';
}

function getWeddingSelectionsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets().find((candidate) => candidate.getSheetId() === SHEET_GID);

  if (!sheet) {
    throw new Error(`Sheet tab with gid ${SHEET_GID} was not found.`);
  }

  const firstRow = sheet.getRange(1, 1, 1, Math.max(HEADERS.length, sheet.getLastColumn())).getValues()[0];
  const hasMealTypeColumn = firstRow.includes('Meal Type');
  const starterIndex = firstRow.indexOf('Starter');
  if (!hasMealTypeColumn && starterIndex >= 0) {
    sheet.insertColumnBefore(starterIndex + 1);
  }

  const rowAfterMealType = sheet.getRange(1, 1, 1, Math.max(HEADERS.length, sheet.getLastColumn())).getValues()[0];
  const hasKidsColumn = rowAfterMealType.includes('Kids Food Request');
  const lastUpdatedIndex = rowAfterMealType.indexOf('Last Updated');

  if (!hasKidsColumn && lastUpdatedIndex >= 0) {
    sheet.insertColumnBefore(lastUpdatedIndex + 1);
  }

  const updatedFirstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = HEADERS.every((header, index) => updatedFirstRow[index] === header);

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

    const sheet = getWeddingSelectionsSheet();
    const guests = Array.isArray(payload.guests) && payload.guests.length > 0
      ? payload.guests
      : [
          {
            guestName: payload.guestName || '',
            rsvp: payload.rsvp || (payload.submissionType === 'Rsvp Declined' ? 'Miss' : 'Attend'),
            activity: payload.activity || '',
            mealType: payload.mealType || 'Adult',
            starter: payload.starter || '',
            main: payload.main || '',
            dessert: payload.dessert || '',
            allergies: payload.allergies || '',
            kidsMeal: payload.kidsMeal || '',
          },
        ];

    const lastRow = sheet.getLastRow();
    const existingRows =
      lastRow > 1
        ? sheet
            .getRange(2, 1, lastRow - 1, HEADERS.length)
            .getValues()
        : [];
    let lastTargetRow = lastRow;

    guests.forEach((guest) => {
      const guestName = String(guest.guestName || payload.guestName || '').trim();
      if (!guestName) {
        return;
      }

      const existingIndex = existingRows.findIndex((row) => {
        const rowName = String(row[0]).trim().toLowerCase();
        const rowEmail = String(row[1]).trim().toLowerCase();
        return rowName === guestName.toLowerCase() && rowEmail === guestEmail;
      });
      const targetRow = existingIndex >= 0 ? existingIndex + 2 : sheet.getLastRow() + 1;
      lastTargetRow = targetRow;

      sheet
        .getRange(targetRow, 1, 1, HEADERS.length)
        .setValues([
          [
            guestName,
            payload.guestEmail || '',
            guest.rsvp || (payload.submissionType === 'Rsvp Declined' ? 'Miss' : 'Attend'),
            cleanActivityLabel(guest.activity),
            guest.rsvp === 'Miss' ? '' : guest.mealType || 'Adult',
            cleanFoodLabel(guest.starter),
            cleanFoodLabel(guest.main),
            cleanFoodLabel(guest.dessert),
            guest.allergies || '',
            guest.kidsMeal || '',
            payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
          ],
        ]);
    });

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, row: lastTargetRow }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: error.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
