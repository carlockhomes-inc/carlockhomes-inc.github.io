function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📝 システム処理')
    .addItem('🔧 初期セットアップ（シート構築）', 'initialSetup')
    .addItem('🎨 テスト用テンプレート自動描画', 'buildTestTemplates') // ★追加
    .addItem('🖨️ ドキュメント一括PDF化（準備中）', 'generateDocuments')
    .addToUi();
}

function buildTestTemplates() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 各シートにレイアウトを自動描画
  buildReportTemplate(ss.getSheetByName("📄報告書"));
  buildEstimateTemplate(ss.getSheetByName("📄見積書"), "御見積書");
  buildEstimateTemplate(ss.getSheetByName("📄請求書"), "ご請求書");
  
  SpreadsheetApp.getUi().alert('テスト用のテンプレート構築が完了しました！\n各シートをご確認ください。');
}

// ============================================
// 報告書（モリモト書式）のレイアウト生成
// ============================================
function buildReportTemplate(sheet) {
  if (!sheet) return;
  sheet.clear(); // 初期化
  
  // モリモト書式を再現
  sheet.getRange("A2").setValue("受付No. :");
  sheet.getRange("B2").setValue("[受付No. 差込]"); 
  
  sheet.getRange("A4:C4").merge().setValue("[顧客名 差込] 御中").setFontSize(14).setFontWeight("bold");
  
  sheet.getRange("D5").setValue("[依頼者名 差込]");
  sheet.getRange("F5").setValue("[作業日 差込]").setHorizontalAlignment("right");
  
  sheet.getRange("A6").setValue("住所");
  sheet.getRange("B6:C6").merge().setValue("[住所 差込]");
  
  sheet.getRange("A8").setValue("お名前");
  sheet.getRange("B8").setValue("[お客様名 差込]");
  sheet.getRange("D8").setValue("連絡先");
  sheet.getRange("E8").setValue("[連絡先 差込]");
  
  sheet.getRange("A9:B9").merge().setValue("モリモトクオリティ依頼者名");
  sheet.getRange("C9").setValue("[担当者 差込]"); 
  
  // 依頼内容・作業担当者枠
  sheet.getRange("A11:C11").merge().setValue("【依頼内容・作業内容】").setFontWeight("bold");
  sheet.getRange("A13").setValue("依頼内容");
  sheet.getRange("B13:F14").merge().setValue("[依頼内容サマリー 差込]").setVerticalAlignment("top").setWrap(true);
  
  sheet.getRange("A16").setValue("作業担当者");
  sheet.getRange("B16").setValue("[作業担当者 差込]");
  
  // 明細枠
  sheet.getRange("A18:B18").merge().setValue("【作業料金明細】").setFontWeight("bold");
  const headers = ["品名", "数量", "単価", "金額"];
  sheet.getRange(19, 1, 1, 4).setValues([headers]).setBackground("#d9d9d9").setFontWeight("bold").setHorizontalAlignment("center");
  
  // 枠線の設定（明細）
  sheet.getRange(19, 1, 6, 4).setBorder(true, true, true, true, true, true);
  
  for (let i = 0; i < 5; i++) {
    sheet.getRange(20+i, 1).setValue(`[品名${i+1} 差込]`);
    sheet.getRange(20+i, 2).setValue(`[数量${i+1} 差込]`);
    sheet.getRange(20+i, 3).setValue(`[単価${i+1} 差込]`);
    sheet.getRange(20+i, 4).setValue(`[金額${i+1} 差込]`);
  }
  
  // 金額計算エリア
  sheet.getRange("C26").setValue("小計");
  sheet.getRange("D26").setValue("¥ [合計算出]");
  sheet.getRange("C27").setValue("消費税（10%）");
  sheet.getRange("D27").setValue("¥ [税算出]");
  sheet.getRange("C28").setValue("合計").setFontWeight("bold");
  sheet.getRange("D28").setValue("¥ [合計金額]").setFontWeight("bold");
  
  sheet.getRange("A30").setValue("備考");
  sheet.getRange("A31:D32").merge().setValue("[備考 差込]").setVerticalAlignment("top").setBorder(true, true, true, true, null, null);
  
  sheet.getRange("A34:D34").merge().setValue("本社：カーロックホームズ株式会社  TEL:03-5311-0556  FAX:03-5311-0558");
  
  // 列幅調整
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 90);
  sheet.setColumnWidth(4, 110);
  sheet.setColumnWidth(5, 110);
}

// ============================================
// 見積書・請求書のレイアウト生成（共通）
// ============================================
function buildEstimateTemplate(sheet, title) {
  if (!sheet) return;
  sheet.clear();
  
  // タイトル
  sheet.getRange("A1:F2").merge().setValue(title).setFontSize(18).setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  
  // ヘッダー情報
  sheet.getRange("A4:C4").merge().setValue("[顧客名 差込] 御中").setFontSize(14).setFontWeight("bold").setBorder(null, null, true, null, null, null);
  sheet.getRange("A6:D7").merge().setValue("下記の通り、ご提示申し上げます。").setVerticalAlignment("top"); 
  
  sheet.getRange("E4").setValue("受付No.");
  sheet.getRange("F4").setValue("[受付No. 差込]");
  sheet.getRange("E5").setValue("発行日:");
  sheet.getRange("F5").setValue("[日付 差込]");
  
  sheet.getRange("E7:F7").merge().setValue("カーロックホームズ株式会社").setFontWeight("bold");
  sheet.getRange("E8:F8").merge().setValue("〒000-0000 東京都世田谷区...");
  sheet.getRange("E9:F9").merge().setValue("TEL: 03-5311-0556");
  
  sheet.getRange("A9").setValue("合計金額").setFontSize(14).setBackground("#d9d9d9").setHorizontalAlignment("center");
  sheet.getRange("B9:C9").merge().setValue("¥ [すべての合計金額]").setFontSize(14).setFontWeight("bold").setBorder(null, null, true, null, null, null);
  
  // 明細
  const headers = ["品番・品名", "数量", "単位", "単価", "金額", "備考"];
  sheet.getRange(12, 1, 1, 6).setValues([headers]).setBackground("#4a86e8").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  
  // 枠線の設定（明細）
  sheet.getRange(12, 1, 6, 6).setBorder(true, true, true, true, true, true);
  
  for (let i = 0; i < 5; i++) {
    sheet.getRange(13+i, 1).setValue(`[品名${i+1} 差込]`);
    sheet.getRange(13+i, 2).setValue(`[数量${i+1} 差込]`);
    sheet.getRange(13+i, 3).setValue("式");
    sheet.getRange(13+i, 4).setValue(`[単価${i+1} 差込]`);
    sheet.getRange(13+i, 5).setValue(`[金額${i+1} 差込]`);
  }
  
  // 小計・消費税・合計
  sheet.getRange("D19").setValue("小計");
  sheet.getRange("E19").setValue("¥ [合計算出]");
  
  sheet.getRange("D20").setValue("消費税 (10%)");
  sheet.getRange("E20").setValue("¥ [税算出]");
  
  sheet.getRange("D21").setValue("合計").setFontWeight("bold");
  sheet.getRange("E21").setValue("¥ [合計金額]").setFontWeight("bold");
  
  // 備考
  sheet.getRange("A23").setValue("備考:");
  sheet.getRange("A24:E26").merge().setValue("[備考 差込]").setVerticalAlignment("top").setBorder(true, true, true, true, null, null);
  
  // 横幅調整
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 60);
  sheet.setColumnWidth(3, 60);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 120);
}
