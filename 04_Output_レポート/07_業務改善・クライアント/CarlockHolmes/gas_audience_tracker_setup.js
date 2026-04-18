/**
 * オーディエンス属性（年齢層・性別）記録シート 自動構築ツール
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🔍 属性データ管理")
      .addItem("1: 月次オーディエンス記録シートを作成", "setupAudienceSheet")
      .addToUi();
}

function setupAudienceSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "🔍 オーディエンス記録";
  
  // すでにシートがある場合は警告して終了
  if (ss.getSheetByName(sheetName)) {
    SpreadsheetApp.getUi().alert('すでに「' + sheetName + '」シートが存在します！');
    return;
  }
  
  // 新しいシートを作成
  const sheet = ss.insertSheet(sheetName);
  
  // ヘッダーの設定
  const headers = [
    ["記録日（月末等）", "👩 女性比率", "👨 男性比率", "🎯 35〜44歳", "🎯 45〜54歳", "🔥 コア層合計", "その他の年代", "フォロワー増減比", "📝 月の振り返り・考察（何がウケたか等）"]
  ];
  
  const range = sheet.getRange(1, 1, 1, headers[0].length);
  range.setValues(headers);
  
  // ヘッダーのデザイン
  range.setBackground("#4a86e8")
       .setFontColor("white")
       .setFontWeight("bold")
       .setHorizontalAlignment("center")
       .setVerticalAlignment("middle");
  
  // 行の高さを少し広げる
  sheet.setRowHeight(1, 40);
  
  // 列幅の調整
  sheet.setColumnWidth(1, 130); // 記録日
  sheet.setColumnWidth(2, 100); // 女性比率
  sheet.setColumnWidth(3, 100); // 男性比率
  sheet.setColumnWidth(4, 110); // 35〜44歳
  sheet.setColumnWidth(5, 110); // 45〜54歳
  sheet.setColumnWidth(6, 120); // コア層合計
  sheet.setColumnWidth(7, 120); // その他
  sheet.setColumnWidth(8, 130); // フォロワー増減
  sheet.setColumnWidth(9, 350); // 考察
  
  // F列（コア層合計）に自動計算の数式をセット（2行目〜100行目まで）
  // 35-54歳の合計（CarlockHolmesの最重要ターゲット）の推移を色付きで可視化します
  const formulaRange = sheet.getRange("F2:F100");
  formulaRange.setFormula("=IF(D2=\"\",\"\",D2+E2)");
  formulaRange.setBackground("#fff2cc").setHorizontalAlignment("center").setFontWeight("bold");
  
  // 枠線の固定（1行目と1列目）
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  
  // 行2に今日の日付と、今回教えていただいた実際のデータ（ダミー）を入れておく
  const dummyData = [
    ["2026/04/01", 0.70, 0.30, 0.532, 0.353, "", 0.115, "+10人増", "（例）Instagramのインサイトから転記。35〜54歳の層が○○%を占めている事が分かったので、この層に向けたサービス発信を強化する！"]
  ];
  sheet.getRange(2, 1, 1, dummyData[0].length).setValues(dummyData);
  
  // B列〜G列の表示形式をまとめて「パーセント（%）」に変更
  sheet.getRange("B2:G100").setNumberFormat("0.0%");
  
  SpreadsheetApp.getUi().alert('最強のオーディエンス記録シートの構築が完了しました！\nまずは2行目のデータ（実際に教えていただいたパーセンテージ）を見て、入力の参考にしてください。');
}
