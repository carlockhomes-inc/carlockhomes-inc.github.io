/**
 * 統合ドキュメント自動生成システム - Day 1 MVP
 * Step 1: 初期シートの自動構築スクリプト
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📝 システム処理')
    .addItem('🔧 初期セットアップ（シート構築）', 'initialSetup')
    .addItem('🖨️ ドキュメント一括PDF化（準備中）', 'generateDocuments')
    .addToUi();
}

function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 必要なシート名
  const sheetNames = ["案件マスター", "⚙️設定", "📄見積書", "📄報告書", "📄請求書"];
  
  // シートを作成（無ければ）
  sheetNames.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
  
  // 不要な初期シート（シート1など）を削除
  const defaultSheet = ss.getSheetByName("シート1");
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
  
  // ---------------------------------------------
  // 1. 案件マスターのセットアップ
  // ---------------------------------------------
  const masterSheet = ss.getSheetByName("案件マスター");
  const headers = [
    "✅出力", "受付No.", "作業日", "管理組合名\n(顧客名)", "住所", 
    "依頼者名\n(お客様名)", "連絡先\n(TEL)", "作業担当者", "依頼内容\n(サマリー)",
    "備考", 
    "品名1", "数量1", "単価1", "金額1",
    "品名2", "数量2", "単価2", "金額2",
    "品名3", "数量3", "単価3", "金額3",
    "品名4", "数量4", "単価4", "金額4",
    "品名5", "数量5", "単価5", "金額5"
  ];
  
  // ヘッダーを1行目に書き込む
  masterSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // デザイン（ヘッダーの色など）
  masterSheet.getRange(1, 1, 1, headers.length).setBackground("#4a86e8").setFontColor("white").setFontWeight("bold");
  
  // チェックボックスをA列に設定（見出しを除いて2行目から100行目まで）
  masterSheet.getRange(2, 1, 99, 1).insertCheckboxes();
  
  // 列幅の調整
  masterSheet.setColumnWidth(1, 60);
  masterSheet.setColumnWidth(2, 100);
  masterSheet.setColumnWidth(4, 180);
  masterSheet.setColumnWidth(5, 200);
  masterSheet.setColumnWidth(9, 250);
  
  // ウィンドウ枠の固定（1行目と2列目を固定）
  masterSheet.setFrozenRows(1);
  masterSheet.setFrozenColumns(2);
  
  // ---------------------------------------------
  // 2. 設定シートのセットアップ
  // ---------------------------------------------
  const configSheet = ss.getSheetByName("⚙️設定");
  const configData = [
    ["消費税率", 0.1],
    ["自社名", "カーロックホームズ株式会社"],
    ["電話番号", "03-5311-0556"],
    ["FAX", "03-5311-0558"]
  ];
  
  configSheet.getRange(1, 1, configData.length, 2).setValues(configData);
  configSheet.getRange(1, 1, configData.length, 1).setBackground("#cccccc").setFontWeight("bold");
  configSheet.getRange("B1").setNumberFormat("0%");
  
  configSheet.setColumnWidth(1, 120);
  configSheet.setColumnWidth(2, 250);
  
  SpreadsheetApp.getUi().alert('初期セットアップが完了しました！\n「案件マスター」シートなどに枠組みが作成されました。');
}

// 次のフェーズで実装する処理のプレースホルダー
function generateDocuments() {
  SpreadsheetApp.getUi().alert('（Phase 2: 次のステップで、ここにPDF化と転記処理を追加します）');
}
