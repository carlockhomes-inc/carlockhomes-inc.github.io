/**
 * CarlockHomes 採用サイト フォーム受信スクリプト
 * ================================================
 * Google Apps Script (GAS) として動作します。
 * スプレッドシートに「エントリー」「お問い合わせ」の2シートを自動作成し、
 * フォームの送信データを記録します。
 *
 * 【デプロイ手順】
 * 1. https://script.google.com を開く
 * 2. 「新しいプロジェクト」を作成
 * 3. このコードを貼り付けて保存（Ctrl+S）
 * 4. 「デプロイ」→「新しいデプロイ」
 * 5. 種類: 「ウェブアプリ」を選択
 * 6. 実行するユーザー: 「自分」
 * 7. アクセスできるユーザー: 「全員」(Anyone)
 * 8. 「デプロイ」→ 表示されたURLをコピー
 * 9. index.html の GAS_ENTRY_URL / GAS_CONTACT_URL に貼り付ける
 */

// ── スプレッドシートID（空のままでOK → 自動で現在のスプレッドシートを使用）
const SPREADSHEET_ID = '';  // 特定のスプレッドシートを指定する場合はIDを入力

// ── シート名
const SHEET_ENTRY   = 'エントリー';
const SHEET_CONTACT = 'お問い合わせ';

// ── ヘッダー定義
const ENTRY_HEADERS   = ['受信日時', 'お名前', '年齢', '電話/メール', '希望の働き方', '趣味・自己PR'];
const CONTACT_HEADERS = ['受信日時', '種別', '会社名/お名前', 'メールアドレス', '電話番号', 'お問い合わせ内容'];


/**
 * POST リクエストを受け取るメイン関数
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const type   = params.type; // 'entry' or 'contact'

    const ss = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    if (type === 'entry') {
      writeEntry(ss, params);
    } else if (type === 'contact') {
      writeContact(ss, params);
    } else {
      throw new Error('不明なフォーム種別: ' + type);
    }

    return buildResponse({ success: true, message: '受信完了' });

  } catch (err) {
    console.error(err);
    return buildResponse({ success: false, message: err.message });
  }
}

/**
 * エントリーをシートに書き込む
 */
function writeEntry(ss, params) {
  const sheet = getOrCreateSheet(ss, SHEET_ENTRY, ENTRY_HEADERS);
  const now   = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

  sheet.appendRow([
    now,
    params.name    || '',
    params.age     || '',
    params.contact || '',
    params.workStyle || '',
    params.pr      || '',
  ]);
}

/**
 * お問い合わせをシートに書き込む
 */
function writeContact(ss, params) {
  const sheet = getOrCreateSheet(ss, SHEET_CONTACT, CONTACT_HEADERS);
  const now   = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

  sheet.appendRow([
    now,
    params.contactType || '',
    params.name        || '',
    params.email       || '',
    params.tel         || '',
    params.body        || '',
  ]);
}

/**
 * シートが存在しなければ作成してヘッダーを追加
 */
function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // ヘッダー行を設定
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4D96FF');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);

    // 列幅を自動調整
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

/**
 * CORS対応のJSONレスポンスを返す
 */
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * テスト用（GASエディタから実行して動作確認できます）
 */
function testEntry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  writeEntry(ss, {
    name: 'テスト 太郎',
    age: '52',
    contact: '090-0000-0000',
    workStyle: 'まずは相談したい',
    pr: 'ゲームが好きです'
  });
  console.log('エントリーのテスト書き込み完了');
}

function testContact() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  writeContact(ss, {
    contactType: '企業・業務提携',
    name: '株式会社テスト',
    email: 'test@example.com',
    tel: '03-0000-0000',
    body: 'サービスについてお伺いしたいです。'
  });
  console.log('お問い合わせのテスト書き込み完了');
}
