/**
 * CarlockHomes Recruitment Form - GAS Backend (v18.2 ULTRA-DEBUG)
 */

const ADMIN_EMAIL = "m.lab.biz.tokyo@gmail.com";
const ALLOWED_HOSTNAME = "fmfmfm0207-max.github.io";

function doPost(e) {
  console.log("CRITICAL DEBUG: doPost triggered");
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    console.log("Boud SS URL:", ss.getUrl());
    console.log("Bound SS ID:", ss.getId());

    const p = JSON.parse(e.postData.contents);
    console.log("Input Payload:", JSON.stringify(p));

    // 認証スキップテスト（まずは確実に書き込めるか確認）
    const type = p.type || 'entry';
    const sheet = ss.getSheetByName(type === 'entry' ? 'エントリー' : 'お問い合わせ');
    const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
    
    const rowData = [
      timestamp,
      p.name || "NO NAME",
      p.age || "",
      p.contact || p.email || "",
      p.workStyle || "",
      p.pr || p.body || "",
      p.source || "",
      "v18.2-ULTRA-DEBUG"
    ];
    
    sheet.appendRow(rowData);
    console.log("Row successfully appended to sheet:", sheet.getName());

    // reCAPTCHA検証（とりあえず通す設定にしてログだけ見る）
    const reToken = p.recaptcha_token;
    const secretKey = PropertiesService.getScriptProperties().getProperty("RECAPTCHA_SECRET") || "6Lcq8rOsAAAAAFanKr1Q2Wxm5XLEX8QAx_XZ7OoF";
    const vResp = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: secretKey, response: reToken },
      muteHttpExceptions: true
    });
    console.log("reCAPTCHA Result:", vResp.getContentText());

    return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Recorded-v18.2"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("DEBUG ERROR:", err.toString());
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
