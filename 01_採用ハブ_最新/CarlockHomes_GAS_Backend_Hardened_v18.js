/**
 * CarlockHomes Backend (v26.1-STEALTH-HARDENED)
 * 監査の指摘に基づき、ステルス防御（不審な通信には成功を装いデータを保存しない）を実装。
 */

const ADMIN_EMAIL = "m.lab.biz.tokyo@gmail.com";
const ALLOWED_HOSTNAME = "fmfmfm0207-max.github.io";
const EXPECTED_TOKEN = "CLH-2026-XK9mP4wR7vTqN2sZ"; // クライアント側に露出しているが、最低限のチェックとして維持

function doPost(e) {
  const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  let p = {};
  try {
    p = JSON.parse(e.postData.contents);
    const reToken = (p.recaptcha_token || "").trim();
    const secretKey = "6Lfi6MEsAAAAAGPFmJLhXlvA9u6h_E8CPvQAjDLp"; 

    // 1. Google検証
    const options = {
      method: "post",
      payload: { secret: secretKey, response: reToken },
      muteHttpExceptions: true
    };
    
    const verifyResponse = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', options);
    const verifyData = JSON.parse(verifyResponse.getContentText());

    // 【重要】ステルス防御：検証失敗時はログのみ残し、攻撃者には成功(200)を返す
    if (!verifyData.success || (verifyData.score && verifyData.score < 0.5)) {
      logAudit(timestamp, "RECAPTCHA_DENIED", `Score: ${verifyData.score || "none"}, Error: ${JSON.stringify(verifyData["error-codes"] || "none")}`, p);
      return responseSuccess("Ok (Stealth)"); 
    }

    // 2. アクセストークンチェック（簡易的な確認）
    if (p.access_token !== EXPECTED_TOKEN) {
      logAudit(timestamp, "TOKEN_MISMATCH", "Invalid access_token attempted", p);
      return responseSuccess("Ok (Stealth)");
    }

    // 3. スプレッドシートへの書き込み
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const clean = (val) => val ? String(val).slice(0, 1500).replace(/^[=+\-@]/, "'") : "";

    if (p.type === 'entry') {
      let sheet = ss.getSheetByName("エントリー") || ss.insertSheet("エントリー");
      sheet.appendRow([timestamp, clean(p.name), clean(p.age), clean(p.contact), clean(p.workStyle), clean(p.pr), clean(p.source), "v26.1-SECURE"]);
    } else {
      let sheet = ss.getSheetByName("お問い合わせ") || ss.insertSheet("お問い合わせ");
      sheet.appendRow([timestamp, clean(p.name), clean(p.contactType), clean(p.tel + " / " + p.email), clean(p.body), clean(p.source), "v26.1-SECURE"]);
    }
    
    logAudit(timestamp, "SUCCESS", "Valid Transaction Completed", p);
    return responseSuccess("Ok");

  } catch (err) {
    logAudit(timestamp, "SYSTEM_ERROR", err.toString(), p);
    return responseSuccess("Ok (Error-Stealth)"); // システムエラー時も成功のふりをする
  }
}

function logAudit(ts, type, detail, p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("セキュリティログ") || ss.insertSheet("セキュリティログ");
    // 監査の指摘に基づき、セキュリティログに個人情報をそのまま残さないよう配慮
    const maskedName = p.name ? p.name.substring(0,1) + "**" : "-";
    sheet.appendRow([ts, type, detail, p.request_origin || "Unknown", maskedName, "PII Masked"]);
  } catch(e) {}
}

function responseSuccess(msg) {
  return ContentService.createTextOutput(JSON.stringify({status:"success", message:msg}))
    .setMimeType(ContentService.MimeType.JSON);
}
