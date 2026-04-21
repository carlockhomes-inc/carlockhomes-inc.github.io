/**
 * CarlockHomes Recruitment Form - GAS Backend (v18.7-AUDIT-AUTO)
 * 全自動：シートが無くても自動作成し、監査ログを記録します。
 * これをまるごとコピーして、Google Apps Scriptに貼り付けて「新しいデプロイ」をしてください。
 */

const ADMIN_EMAIL = "m.lab.biz.tokyo@gmail.com";
const ALLOWED_HOSTNAME = "fmfmfm0207-max.github.io";
const TOKEN_EXPIRY_SEC = 60;
const EXPECTED_TOKEN = "CLH-2026-XK9mP4wR7vTqN2sZ";

// --- Helpers (Always available) ---
const truncate = (str, len = 1000) => (str ? String(str).slice(0, len) : "");
const clean = (val) => {
  const s = truncate(val);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
};

function doPost(e) {
  const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  let p = {};
  
  try {
    if (!e || !e.postData || !e.postData.contents) {
      logAudit(timestamp, "PROTOCOL_ERROR", "Empty postData", {});
      return responseError("Empty Request", 400);
    }
    
    p = JSON.parse(e.postData.contents);
    const type = truncate(p.type, 20);
    
    // 1. アクセストークンチェック
    if (p.access_token !== EXPECTED_TOKEN) {
      logAudit(timestamp, "INVALID_TOKEN", "トークン不一致: " + (p.access_token || "なし"), p);
      return responseError("Forbidden: Access Denied", 403);
    }

    // 2. レート制限
    const cache = CacheService.getScriptCache();
    const rateKey = "rate_" + Utilities.base64Encode(truncate(p.contact || p.email || p.name, 50));
    if (cache.get(rateKey)) {
      logAudit(timestamp, "RATE_LIMIT", "レート制限超過: " + rateKey, p);
      return responseError("Too Many Requests: Please wait 60s", 429);
    }
    cache.put(rateKey, "1", TOKEN_EXPIRY_SEC);

    // 3. Honeypot (Bot検知)
    if ((p.company_verify && p.company_verify !== "") || (p.office_confirm && p.office_confirm !== "")) {
      logAudit(timestamp, "HONEYPOT_TRIGGERED", "ハニーポット入力あり", p);
      return responseError("Honeypot Triggered", 400);
    }

    // 4. reCAPTCHA v3
    const reToken = p.recaptcha_token || "";
    const BLOCK_TOKENS = ["TIMEOUT_OR_BLOCKED", "NOT_LOADED", "EXECUTE_ERROR", "CATCH_ERROR"];
    if (!reToken || BLOCK_TOKENS.includes(reToken)) {
      logAudit(timestamp, "BAD_RECAPTCHA_TOKEN", "判定不能トークン: " + reToken, p);
      return responseError("Invalid Verification Token", 400);
    }

    const secretKey = PropertiesService.getScriptProperties().getProperty("RECAPTCHA_SECRET") || "6Lcq8rOsAAAAAFanKr1Q2Wxm5XLEX8QAx_XZ7OoF";
    const verifyResponse = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: secretKey, response: reToken },
      muteHttpExceptions: true
    });
    
    const verifyData = JSON.parse(verifyResponse.getContentText());

    if (!verifyData.success) {
      logAudit(timestamp, "RECAPTCHA_FAIL", "Verification Fail: " + JSON.stringify(verifyData['error-codes']), p);
      return responseError("Verification Failed", 400);
    }
    
    // Hostname / Scoreチェック
    if (verifyData.hostname !== ALLOWED_HOSTNAME && verifyData.hostname !== "localhost" && verifyData.hostname) {
      logAudit(timestamp, "DOMAIN_MISMATCH", "不正ドメイン: " + verifyData.hostname, p);
      return responseError("Invalid Hostname", 400);
    }
    
    if (typeof verifyData.score === 'number' && verifyData.score < 0.3) {
      logAudit(timestamp, "LOW_SCORE", "スコア不足: " + verifyData.score, p);
      return responseError("Low Security Score", 400);
    }

    // 5. 書き込み実行 (シートの自動作成付き)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = (type === 'entry' ? 'エントリー' : 'お問い合わせ');
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (type === 'entry') {
        sheet.appendRow(["日時", "名前", "年齢", "連絡先", "働き方", "PR", "流入源", "Version"]);
      } else {
        sheet.appendRow(["日時", "名前", "種別", "連絡先", "内容", "流入源", "Version"]);
      }
      sheet.getRange("A1:H1").setBackground("#e7f3ff").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    let rowData = [];
    if (type === 'entry') {
      rowData = [timestamp, clean(p.name), clean(p.age), clean(p.contact), clean(p.workStyle), clean(p.pr), clean(p.source), "V18.7-AUTO"];
    } else {
      rowData = [timestamp, clean(p.name), clean(p.contactType), clean((p.tel ? p.tel + " / " : "") + (p.email || "")), clean(p.body), clean(p.source), "V18.7-AUTO"];
    }
    sheet.appendRow(rowData);
    
    logAudit(timestamp, "SUCCESS", "正常に書き込み完了", p);
    sendEmails(p, type);
    
    return responseSuccess("Successfully Submitted");

  } catch (err) {
    logAudit(timestamp, "SYSTEM_ERROR", err.toString(), p);
    return responseError("System Error", 500);
  }
}

/**
 * 監査ログ取得ユニット (自動作成機能あり)
 */
function logAudit(ts, type, detail, p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("セキュリティログ");
    if (!sheet) {
      sheet = ss.insertSheet("セキュリティログ");
      sheet.appendRow(["日時", "種別", "詳細", "ドメイン", "名前", "Payload"]);
      sheet.getRange("A1:F1").setBackground("#ffe7e7").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([ts, type, detail, p.request_origin || "Unknown", p.name || "-", JSON.stringify(p)]);
  } catch(e) {}
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
  try {
    const adminSubject = `【CLH検知】${type === 'entry' ? 'エントリー' : 'お問い合わせ'} (${p.name}様)`;
    const adminBody = `名前: ${p.name}\n内容: ${p.body || p.pr}\n`;
    MailApp.sendEmail(ADMIN_EMAIL, adminSubject, adminBody);
  } catch(e) {}
}
