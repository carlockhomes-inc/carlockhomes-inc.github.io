const SPREADSHEET_ID = '12Q8LWHjtkb0KW18KtQ_uqcEk2lfJXXGAwhGt9KlUhvM';
const SHEET_ENTRY = 'エントリー';
const SHEET_CONTACT = 'お問い合わせ';
const ENTRY_HEADERS = ['受信日時', 'お名前', '年齢', '電話/メール', '希望の働き方', '趣味・自己PR', '流入元ページ', 'アクセス元'];
const CONTACT_HEADERS = ['受信日時', '種別', '会社名/お名前', 'メールアドレス', '電話番号', 'お問い合わせ内容', '流入元ページ', 'アクセス元'];

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const type = params.type;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (type === 'entry') {
      writeEntry(ss, params);
    } else if (type === 'contact') {
      writeContact(ss, params);
    } else {
      throw new Error('Unknown type: ' + type);
    }
    return buildResponse({ success: true, message: 'Success' });
  } catch (err) {
    console.error(err);
    return buildResponse({ success: false, message: err.message });
  }
}

function writeEntry(ss, params) {
  const sheet = getOrCreateSheet(ss, SHEET_ENTRY, ENTRY_HEADERS);
  const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  sheet.appendRow([
    now,
    params.name || '',
    params.age || '',
    params.contact || '',
    params.workStyle || '',
    params.pr || '',
    params.source || '',
    params.traffic || ''
  ]);
}

function writeContact(ss, params) {
  const sheet = getOrCreateSheet(ss, SHEET_CONTACT, CONTACT_HEADERS);
  const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  sheet.appendRow([
    now,
    params.contactType || '',
    params.name || '',
    params.email || '',
    params.tel || '',
    params.body || '',
    params.source || '',
    params.traffic || ''
  ]);
}

function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4D96FF');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function buildResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
