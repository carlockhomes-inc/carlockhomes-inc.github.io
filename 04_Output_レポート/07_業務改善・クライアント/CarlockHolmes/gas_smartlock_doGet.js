/**
 * Google Apps Script - doGet Function
 * CarlockHomes - Smart Lock Site Integration
 *
 * デプロイ方法:
 * 1. GAS管理画面（script.google.com）で新しくプロジェクトを作成
 * 2. このコードを貼り付ける
 * 3. 「デプロイ」>「新しいデプロイ」から「WEBアプリ」を選択
 * 4. アクセスできるユーザーを「全員(匿名ユーザー含む)」にしてデプロイ
 * 5. 生成されたURLをHPのiframeなどで使用
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('smartlock') // smartlock.htmlを読み込み
    .setTitle('電気錠・スマートロック — CarlockHomes') // ブランド表記の統一
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // 埋め込み表示を許可
}
