/**
 * RSVP receiver for the Mahima & Ayush invitation.
 *
 * Every reply sent from the RSVP form on bride.html or groom.html arrives
 * here and is added as one row of the "RSVP" tab of the Google Sheet this
 * script is attached to.
 *
 * SETTING IT UP (once):
 *   1. Create a new Google Sheet, e.g. "Mahima & Ayush — RSVPs".
 *   2. In it: Extensions > Apps Script. Delete what is there, paste this
 *      whole file in, and save.
 *   3. Deploy > New deployment > type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Deploy, and allow the permissions it asks for.
 *   4. Copy the Web app URL (it ends in /exec) and paste it into
 *      CONFIG.rsvpForm.endpoint in script.js.
 *
 * If you change this script later, use Deploy > Manage deployments > edit >
 * "New version", so the same URL keeps working.
 */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Received', 'Card', 'Name', 'Phone', 'Arrival', 'Departure'];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // The form's hidden honeypot field: people never fill it, bots do.
  if (p.website) return ok_();

  const name = clean_(p.name, 80);
  const phone = clean_(p.phone, 20);
  if (!name || !phone) return ok_();

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);   // two guests replying at once must not share a row
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      p.side === 'groom' ? "Groom's card" : "Bride's card",
      name,
      phone,
      clean_(p.arrival, 10),
      clean_(p.departure, 10),
    ]);
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

/* Trim, cap the length, and stop a reply being read as a formula: a cell
   that starts with = + - or @ is run by Sheets, so it is stored as text. */
function clean_(value, max) {
  const s = String(value || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
