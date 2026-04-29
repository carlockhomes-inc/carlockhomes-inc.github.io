/**
 * CarlockHomes Recruitment Form - GAS Backend (Strict Security Mode)
 * - reCAPTCHA v3 によるスパム判定
 * - 判定NG または Failsafe通信 は完全にシャットアウト（シートに入りません）
 */

function doPost(e) {
  try {
    // 1. データを受け取る (JSON解析)
    var p = JSON.parse(e.postData.contents);

    // 2. アクセストークン認証 (不正な外部連携を最初から防ぐ)
    var expectedToken = "CLH-2026-XK9mP4wR7vTqN2sZ";
    if (p.access_token !== expectedToken) {
      return ContentService.createTextOutput("Forbidden: Invalid Access Token");
    }

    // 3. Stealth Honeypot 認証 (見えない項目を埋めるボット用の罠)
    if ((p.company_verify && p.company_verify !== "") || (p.office_confirm && p.office_confirm !== "")) {
      return ContentService.createTextOutput("Forbidden: Honeypot Triggered");
    }

    // 4. reCAPTCHA v3 認証 (Googleによるボット判定)
    var reToken = p.recaptcha_token || "";
    
    // 偽トークンや、フロントエンドでのタイムアウト（Failsafe）の場合は完全にブロック
    if (reToken === "" || reToken === "TIMEOUT_OR_BLOCKED" || reToken === "NOT_LOADED" || reToken === "test_token_bypass") {
      return ContentService.createTextOutput("Error: Spam Blocked (No Valid Token)");
    }

    // Googleサーバーにトークンの正当性を直接確認
    var secretKey = "6Lcq8rOsAAAAAFanKr1Q2Wxm5XLEX8QAx_XZ7OoF"; // 正しいシークレットキーを埋め込み済み
    var verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    var verifyPayload = {
      'secret': secretKey,
      'response': reToken
    };
    var verifyOptions = {
      'method': 'post',
      'payload': verifyPayload
    };
    var verifyResponse = UrlFetchApp.fetch(verifyUrl, verifyOptions);
    var verifyData = JSON.parse(verifyResponse.getContentText());

    // スコアが低い（0.5未満）またはトークン自体が不正な場合は完全にブロック
    if (!verifyData.success || verifyData.score < 0.5) {
      return ContentService.createTextOutput("Error: Spam Blocked (Low Score or Invalid)");
    }

    // --- 【安全確認完了】これ以降に到達したものは100%安全な正規のご連絡 ---
    
    // 5. スプレッドシートの取得
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet;
    var rowData = [];
    var timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");

    // 6. タイプ（エントリー か お問い合わせ か）ごとに振り分けてシートへ記入
    if (p.type === 'entry') {
      sheet = ss.getSheetByName('エントリー');
      if (!sheet) return ContentService.createTextOutput("Error: Sheet Not Found");

      // 列: 受信日時 | お名前 | 年齢 | 電話/メール | 希望の働き方 | 趣味・自己PR | 流入元ページ | アクセス元
      rowData = [
        timestamp,
        p.name || '不明',
        p.age || '',
        p.contact || '',             
        p.workStyle || '',
        p.pr || '',
        p.source || '直接アクセス',
        p.traffic || 'Secure-V17-Recaptcha'
      ];
      sheet.appendRow(rowData);

    } else if (p.type === 'contact') {
      sheet = ss.getSheetByName('お問い合わせ');
      if (!sheet) return ContentService.createTextOutput("Error: Sheet Not Found");

      // 列: 受信日時 | 会社・お名前 | 用件 | 連絡先(TEL/メール) | お問い合わせ内容 | 流入元ページ | アクセス元
      var contactInfo = (p.tel ? p.tel + " / " : "") + (p.email || "");
      rowData = [
        timestamp,
        p.name || '不明',
        p.contactType || '不明',
        contactInfo,
        p.body || '',
        p.source || '直接アクセス',
        p.traffic || 'Secure-V17-Recaptcha'
      ];
      sheet.appendRow(rowData);
    }

    // 成功を返す
    return ContentService.createTextOutput("Success");

  } catch (err) {
    // 予期せぬシステムエラー
    return ContentService.createTextOutput("Error: " + err.message);
  }
}
