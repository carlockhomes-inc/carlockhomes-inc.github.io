/**
 * CarlockHomes Recruitment Form - GAS Backend (Hardened v18.1 DEBUG)
 * 監査対応 + 詳細ログ出力版
 */

const ADMIN_EMAIL = "m.lab.biz.tokyo@gmail.com";
const ALLOWED_HOSTNAME = "fmfmfm0207-max.github.io";
const TOKEN_EXPIRY_SEC = 60;

function doPost(e) {
  console.log("--- doPost Start ---");
  try {
    const p = JSON.parse(e.postData.contents);
    console.log("Payload:", JSON.stringify(p));

    const truncate = (str, len = 1000) => (str ? String(str).slice(0, len) : "");
    const type = truncate(p.type, 20);
    
    // 1. アクセストークン
    const expectedToken = "CLH-2026-XK9mP4wR7vTqN2sZ";
    if (p.access_token !== expectedToken) {
      console.error("Critical: Token Mismatch. Received:", p.access_token);
      return responseError("Forbidden: Access Denied", 403);
    }

    // 2. レート制限
    const cache = CacheService.getScriptCache();
    const rateKey = "rate_" + Utilities.base64Encode(truncate(p.contact || p.email || p.name, 50));
    if (cache.get(rateKey)) {
      console.warn("Rate limit triggered for:", rateKey);
      return responseError("Too Many Requests: Please wait 60s", 429);
    }
    cache.put(rateKey, "1", TOKEN_EXPIRY_SEC);

    // 3. Honeypot
    if ((p.company_verify && p.company_verify !== "") || (p.office_confirm && p.office_confirm !== "")) {
      console.error("Honeypot Triggered");
      return responseError("Honeypot Triggered", 400);
    }

    // 4. reCAPTCHA v3
    const reToken = p.recaptcha_token || "";
    const BLOCK_TOKENS = ["TIMEOUT_OR_BLOCKED", "NOT_LOADED", "test_token_bypass", "EXECUTE_ERROR", "CATCH_ERROR"];
    if (!reToken || BLOCK_TOKENS.includes(reToken)) {
      console.error("Blocked Token detected:", reToken);
      return responseError("Invalid Verification Token: " + reToken, 400);
    }

    const secretKey = PropertiesService.getScriptProperties().getProperty("RECAPTCHA_SECRET") || "6Lcq8rOsAAAAAFanKr1Q2Wxm5XLEX8QAx_XZ7OoF";
    const verifyResponse = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: secretKey, response: reToken },
      muteHttpExceptions: true
    });
    
    const verifyData = JSON.parse(verifyResponse.getContentText());
    console.log("VerifyData from Google:", JSON.stringify(verifyData));

    if (!verifyData.success) {
      console.error("Google Verification Success: FALSE. Errors:", verifyData['error-codes']);
      return responseError("Verification Failed", 400);
    }
    
    // 監査項目チェック（デバッグログ付き）
    // Hostname
    if (verifyData.hostname !== ALLOWED_HOSTNAME && verifyData.hostname !== "localhost" && verifyData.hostname) {
      console.warn("Hostname mismatch! Hostname is:", verifyData.hostname, "Expected:", ALLOWED_HOSTNAME);
      // 一旦、監査の指摘通り厳しく弾きます
      return responseError("Invalid Hostname: " + verifyData.hostname, 400);
    }
    
    // Action
    const expectedAction = (type === 'entry' ? 'submit' : 'contact');
    if (verifyData.action !== expectedAction) {
      console.warn("Action mismatch! Action is:", verifyData.action, "Expected:", expectedAction);
      return responseError("Invalid Action: " + verifyData.action, 400);
    }
    
    // Score
    if (typeof verifyData.score !== 'number' || verifyData.score < 0.3) { // 開発テスト用に一時的に0.3に緩和（本番は0.5）
      console.warn("Low score:", verifyData.score);
      return responseError("Low Security Score: " + verifyData.score, 400);
    }

    // 5. 書き込み
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(type === 'entry' ? 'エントリー' : 'お問い合わせ');
    const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
    
    const clean = (val) => {
      const s = truncate(val);
      if (/^[=+\-@]/.test(s)) return "'" + s;
      return s;
    };

    let rowData = [];
    if (type === 'entry') {
      rowData = [timestamp, clean(p.name), clean(p.age), clean(p.contact), clean(p.workStyle), clean(p.pr), clean(p.source), "V18.1-DEBUG"];
    } else {
      rowData = [timestamp, clean(p.name), clean(p.contactType), clean((p.tel ? p.tel + " / " : "") + (p.email || "")), clean(p.body), clean(p.source), "V18.1-DEBUG"];
    }
    sheet.appendRow(rowData);
    console.log("Successfully wrote to sheet.");

    sendEmails(p, type);
    return responseSuccess("Successfully Submitted");

  } catch (err) {
    console.error("Stacktrace:", err.stack);
    return responseError("System Error: " + err.message, 500);
  }
}

function responseSuccess(msg) {
  const res = { status: "success", message: msg };
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function responseError(msg, code) {
  const res = { status: "error", message: msg, code: code };
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function sendEmails(p, type) {
  const emailAddr = p.email || (p.contact && p.contact.includes('@') ? p.contact.split(' / ')[1] : null);
  const adminSubject = `【CLH通知】${type === 'entry' ? 'エントリー' : 'お問い合わせ'}がありました (${p.name}様)`;
  const adminBody = `名前: ${p.name}\n内容: ${p.body || p.pr}\n`;
  try { MailApp.sendEmail(ADMIN_EMAIL, adminSubject, adminBody); } catch(e) {}
  if (emailAddr && emailAddr.includes('@')) {
    const userSubject = "【カーロックホームズ】ご連絡ありがとうございます";
    const userBody = `${p.name} 様\nお問い合わせありがとうございます。`;
    try { MailApp.sendEmail(emailAddr, userSubject, userBody); } catch(e) {}
  }
}
