/**
 * Google Apps Script backend for Khánh Linh's graduation invitation.
 *
 * 1) Create a Google Sheet.
 * 2) Extensions -> Apps Script.
 * 3) Paste this file into Code.gs.
 * 4) Run setupSheets() once and authorize.
 * 5) Deploy -> New deployment -> Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6) Copy the Web App URL into public/script.js as GOOGLE_SCRIPT_URL.
 */

const SPREADSHEET_ID = ''; 
function getSpreadsheet_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function setupSheets() {
  const ss = getSpreadsheet_();
  if (!ss) throw new Error('Không tìm thấy Google Sheet. Hãy mở Apps Script từ chính Google Sheet hoặc điền SPREADSHEET_ID.');

  const rsvp = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');

  if (rsvp.getLastRow() >= 1 && rsvp.getLastColumn() >= 4) {
    const headers = rsvp.getRange(1, 1, 1, rsvp.getLastColumn()).getValues()[0];
    const guestsIndex = headers.indexOf('Số người');
    if (guestsIndex !== -1) rsvp.deleteColumn(guestsIndex + 1);
  }

  if (rsvp.getLastRow() === 0) {
    rsvp.appendRow(['Thời gian', 'Họ tên', 'Trạng thái', 'Ghi chú']);
  } else {
    rsvp.getRange(1, 1, 1, 4).setValues([['Thời gian', 'Họ tên', 'Trạng thái', 'Ghi chú']]);
  }
  rsvp.setFrozenRows(1);

  const wishes = ss.getSheetByName('Lời chúc') || ss.insertSheet('Lời chúc');
  if (wishes.getLastRow() === 0) {
    wishes.appendRow(['Thời gian', 'Họ tên', 'Lời chúc']);
    wishes.setFrozenRows(1);
  }
}

function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const action = p.action || 'health';

  try {
    if (action === 'health') return json_({ ok: true, message: 'Google Sheets is connected.' });
    if (action === 'rsvp') return addRsvp_(p);
    if (action === 'wish') return addWish_(p);
    if (action === 'wishes') return listWishes_();
    return json_({ ok: false, message: 'Action không hợp lệ.' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
  }
}

function addRsvp_(p) {
  const name = clean_(p.name, 80);
  const attendance = clean_(p.attendance, 20);
  const note = clean_(p.note, 300);

  if (!name || !['attending', 'not_attending'].includes(attendance)) {
    return json_({ ok: false, message: 'Vui lòng nhập tên và chọn trạng thái tham dự.' });
  }

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');
  if (sheet.getLastRow() === 0) sheet.appendRow(['Thời gian', 'Họ tên', 'Trạng thái', 'Ghi chú']);
  sheet.appendRow([
    new Date(),
    name,
    attendance === 'attending' ? 'Sẽ tham dự' : 'Không thể đến',
    note
  ]);

  return json_({ ok: true, message: 'Đã ghi nhận xác nhận của bạn. Cảm ơn bạn nhé! ♥' });
}

function addWish_(p) {
  const name = clean_(p.name, 80);
  const message = clean_(p.message, 5000);
  if (!name || !message) {
    return json_({ ok: false, message: 'Vui lòng nhập tên và lời chúc.' });
  }

  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('Lời chúc') || ss.insertSheet('Lời chúc');
  if (sheet.getLastRow() === 0) sheet.appendRow(['Thời gian', 'Họ tên', 'Lời chúc']);
  sheet.appendRow([new Date(), name, message]);

  return json_({ ok: true, message: 'Đã gửi lời chúc thành công! ♥' });
}

function listWishes_() {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('Lời chúc');
  if (!sheet || sheet.getLastRow() < 2) return json_([]);

  const last = sheet.getLastRow();
  const start = Math.max(2, last - 49);
  const values = sheet.getRange(start, 1, last - start + 1, 3).getValues();
  const data = values.reverse().map(row => ({
    created_at: row[0],
    name: row[1],
    message: row[2]
  }));
  return json_(data);
}

function clean_(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
