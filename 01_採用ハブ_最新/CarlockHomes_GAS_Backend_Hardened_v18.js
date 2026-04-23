/**
 * CarlockHomes Backend (v26.0-FINAL-FINAL)
 * Google検証の接続方式を「最もエラーが起きにくい形式」に変更しました。
 */

const ADMIN_EMAIL = "m.lab.biz.tokyo@gmail.com";
const ALLOWED_HOSTNAME = "fmfmfm0207-max.github.io";

function doPost(e) {
  const timestamp = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  let p = {};
  try {
    p = JSON.parse(e.postData.contents);
    
    // 【重要：小文字の j であることを確認済み】
    const secretKey = "6Lfi6MEsAAAAAGPFmJLhXlvA9u6h_E8CPvQAjDLp"; 
    const reToken = (p.recaptcha_token || "").trim();

    // 1. Google検証 (接続方式を標準的なフォーム送信形式に固定)
    const options = {
      method: "post",
      payload: {
        secret: secretKey,
        response: reToken
      },
      muteHttpExceptions: true
    };
    
    const verifyResponse = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', options);
    const verifyData = JSON.parse(verifyResponse.getContentText());

    if (!verifyData.success) {
      logAudit(timestamp, "RECAPTCHA_FAIL", "Googleエラー:" + verifyData["error-codes"].join(","), p);
      // 一時的にデータだけは保存したい場合は、ここから下の書き込み処理を外に出すことも可能ですが、
      // セキュリティのため、まずは正攻法で検証を成功させます。
      return responseError("Verify Fail", 400);
    }

    // 2. セキュリティチェック通過後の書き込み
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const clean = (val) => val ? String(val).slice(0, 1500).replace(/^[=+\-@]/, "'") : "";

    if (p.type === 'entry') {
      let sheet = ss.getSheetByName("エントリー") || ss.insertSheet("エントリー");
      sheet.appendRow([timestamp, clean(p.name), clean(p.age), clean(p.contact), clean(p.workStyle), clean(p.pr), clean(p.source), "v26-SUCCESS"]);
    } else {
      let sheet = ss.getSheetByName("お問い合わせ") || ss.insertSheet("お問い合わせ");
      sheet.appendRow([timestamp, clean(p.name), clean(p.contactType), clean(p.tel + " / " + p.email), clean(p.body), clean(p.source), "v26-SUCCESS"]);
    }
    
    logAudit(timestamp, "SUCCESS", "通信成功", p);
    return responseSuccess("Ok");

  } catch (err) {
    logAudit(timestamp, "SYSTEM_ERROR", err.toString(), p);
    return responseError("Error", 500);
  }
}

function logAudit(ts, type, detail, p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("セキュリティログ") || ss.insertSheet("セキュリティログ");
    sheet.appendRow([ts, type, detail, p.request_origin || "Unknown", p.name || "-", JSON.stringify(p)]);
  } catch(e) {}
}
function responseSuccess(msg) { return ContentService.createTextOutput(JSON.stringify({status:"success", message:msg})).setMimeType(ContentService.MimeType.JSON); }
function responseError(msg, code) { return ContentService.createTextOutput(JSON.stringify({status:"error", message:msg, code:code})).setMimeType(ContentService.MimeType.JSON); }
