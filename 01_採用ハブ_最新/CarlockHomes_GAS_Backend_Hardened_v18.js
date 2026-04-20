/**
 * CarlockHomes Recruitment Form - GAS Backend (Hardened v18)
 * 監査報告に基づいたセキュリティ・品質強化版
 */

// 設定
const ADMIN_EMAIL = "m.lab.biz.tokyo@gmail.com"; // 運営通知先
const ALLOWED_HOSTNAME = "fmfmfm0207-max.github.io";
const TOKEN_EXPIRY_SEC = 60; // 同一人物（アドレス/IP）の連投制限

function doPost(e) {
  // CORSプリフライト対応
  if (e.postData.type === "application/x-www-form-urlencoded") {
    // 簡易的な対応
  }

  try {
    const p = JSON.parse(e.postData.contents);
    
    // 1. 基本バリデーション（DoS対策: フィールド長制限）
    const truncate = (str, len = 1000) => (str ? String(str).slice(0, len) : "");
    const type = truncate(p.type, 20);
    const name = truncate(p.name, 100);
    
    // 2. アクセストークン認証
    const expectedToken = "CLH-2026-XK9mP4wR7vTqN2sZ";
    if (p.access_token !== expectedToken) {
      return responseError("Forbidden: Access Denied", 403);
    }

    // 3. レート制限 (CacheService) - 同一アドレスor名前での連投を60秒ブロック
    const cache = CacheService.getScriptCache();
    const rateKey = "rate_" + Utilities.base64Encode(truncate(p.contact || p.email || p.name, 50));
    if (cache.get(rateKey)) {
      return responseError("Too Many Requests: Please wait 60s", 429);
    }
    cache.put(rateKey, "1", TOKEN_EXPIRY_SEC);

    // 4. Stealth Honeypot
    if ((p.company_verify && p.company_verify !== "") || (p.office_confirm && p.office_confirm !== "")) {
      return responseError("Honeypot Triggered", 400);
    }

    // 5. reCAPTCHA v3 厳密検証
    const reToken = p.recaptcha_token || "";
    const BLOCK_TOKENS = ["TIMEOUT_OR_BLOCKED", "NOT_LOADED", "test_token_bypass", "EXECUTE_ERROR", "CATCH_ERROR"];
    if (!reToken || BLOCK_TOKENS.includes(reToken)) {
      return responseError("Invalid Verification Token", 400);
    }

    // シークレットキー取得 (PropertiesService推奨だが、初期移行のためフォールバック付き)
    const secretKey = PropertiesService.getScriptProperties().getProperty("RECAPTCHA_SECRET") || "6Lcq8rOsAAAAAFanKr1Q2Wxm5XLEX8QAx_XZ7OoF";
    
    const verifyResponse = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: { secret: secretKey, response: reToken },
      muteHttpExceptions: true
    });
    
    if (verifyResponse.getResponseCode() !== 200) {
      return responseError("reCAPTCHA Service Unavailable", 503);
    }
    
    const verifyData = JSON.parse(verifyResponse.getContentText());

    // 監査項目：hostname, action, score, success の厳密チェック
    if (!verifyData.success) return responseError("Verification Failed", 400);
    if (verifyData.hostname !== ALLOWED_HOSTNAME && verifyData.hostname !== "localhost") {
      return responseError("Invalid Hostname", 400);
    }
    // actionチェック (フロントでセットしたアクション名と照合)
    const expectedAction = (type === 'entry' ? 'submit' : 'contact');
    if (verifyData.action !== expectedAction) {
      return responseError("Invalid Action", 400);
    }
    // scoreチェック (undefined は弾く)
    if (typeof verifyData.score !== 'number' || verifyData.score < 0.5) {
      return responseError("Low Security Score", 400);
    }

    // 6. スプレッドシート記録 & インジェクション対策
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(type === 'entry' ? 'エントリー' : 'お問い合わせ');
    if (!sheet) return responseError("Internal Configuration Error", 500);

    const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
    
    // 数式インジェクション対策関数
    const clean = (val) => {
      const s = truncate(val);
      if (/^[=+\-@]/.test(s)) return "'" + s;
      return s;
    };

    let rowData = [];
    if (type === 'entry') {
      rowData = [
        timestamp,
        clean(p.name),
        clean(p.age),
        clean(p.contact),
        clean(p.workStyle),
        clean(p.pr),
        clean(p.source),
        "V18-SECURE"
      ];
    } else {
      const contactInfo = clean((p.tel ? p.tel + " / " : "") + (p.email || ""));
      rowData = [
        timestamp,
        clean(p.name),
        clean(p.contactType),
        contactInfo,
        clean(p.body),
        clean(p.source),
        "V18-SECURE"
      ];
    }
    sheet.appendRow(rowData);

    // 7. 自動返信 & 運営通知
    sendEmails(p, type);

    return responseSuccess("Successfully Submitted");

  } catch (err) {
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
  
  // 運営通知
  const adminSubject = `【CLH通知】${type === 'entry' ? 'エントリー' : 'お問い合わせ'}がありました (${p.name}様)`;
  const adminBody = `以下の内容で受信しました。スプレッドシートをご確認ください。\n\n名前: ${p.name}\nタイプ: ${type}\n内容: ${p.body || p.pr}\n`;
  try {
    MailApp.sendEmail(ADMIN_EMAIL, adminSubject, adminBody);
  } catch(e) { console.error("Admin mail failed"); }

  // 応募者への自動返信
  if (emailAddr && emailAddr.includes('@')) {
    const userSubject = "【カーロックホームズ】ご連絡ありがとうございます";
    const userBody = `${p.name} 様\n\nこの度はカーロックホームズへのお問い合わせ、誠にありがとうございます。\n内容を拝読し、担当者より改めてご連絡させていただきます。\n\n※このメールは自動返信です。\n\n----------------------------------\nカーロックホームズ株式会社 採用窓口\nhttps://fmfmfm0207-max.github.io/m-lab/CARLOCKHOMES/\n----------------------------------`;
    try {
      MailApp.sendEmail(emailAddr, userSubject, userBody);
    } catch(e) { console.error("User mail failed"); }
  }
}
