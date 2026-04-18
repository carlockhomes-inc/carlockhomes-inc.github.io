# MQ業務管理システム：設定マニュアル

モリモトクオリティ（MQ）専用のスプレッドシート連携ツールの設定方法です。

## 1. Googleスプレッドシートの準備

1. 使用するスプレッドシート（例: `Morimoto_Test_Copy_Fix`）を開きます。
2. シート名を **`Orders`** に設定してください（または、以下のスクリプト内のシート名を書き換えてください）。
3. 列の構成が以下であることを確認してください：
   - A列 (1): 案番ID (MMQxxxx)
   - B列 (2): 受注日
   - E列 (5): 顧客名
   - J列 (10): 依頼内容 / 対応状況

## 2. Google Apps Script (GAS) の設定

1. スプレッドシートのメニューから **「拡張機能」 > 「Apps Script」** を開きます。
2. もともとあるコードを消して、以下のスクリプトを貼り付けてください。

```javascript
/**
 * MQ業務管理システム 連携スクリプト
 */

function doGet(e) {
  const action = e.parameter.action;
  const query = e.parameter.q;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Orders'); // シート名を確認
  const data = sheet.getDataRange().getValues();
  
  // 読み取り操作 (Read)
  if (action === 'read') {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == query) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          data: {
            id: data[i][0],      // A列: MMQ番号
            date: data[i][1],    // B列: 日付
            customer: data[i][4],// E列: 顧客名
            content: data[i][9]  // J列: 依頼内容
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Not found'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const id = params.id;
  const newContent = params.new_content;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const currentContent = data[i][9] || "";
      const now = new Date();
      const dateStr = Utilities.formatDate(now, "JST", "yyyy/MM/dd HH:mm");
      
      // 既存の内容の末尾に「追記」として書き込む
      const updatedValue = currentContent + "\n\n--- 追記 (" + dateStr + ") ---\n" + newContent;
      
      sheet.getRange(i + 1, 10).setValue(updatedValue); // J列(10列目)を更新
      
      return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}
```

## 3. デプロイ（公開）

1. 右上の **「デプロイ」 > 「新しいデプロイ」** をクリックします。
2. 種類の選択で **「ウェブアプリ」** を選びます。
3. 設定を以下のようにします：
   - 説明: `MQシステム連携 2026/03/17`
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**（※誰でもURLを知っていればアクセス可能になりますが、ツールを動かすために必要です）
4. 「デプロイ」を押し、承認を求められたら許可します。
5. 表示された **「ウェブアプリのURL」** をコピーします。

## 4. HTMLツールへの反映

1. `★MQ業務管理システム_MMQ検索版.html` をメモ帳やテキストエディタで開きます。
2. `<script>` タグ内の `const MQ_GAS_URL = "";` の `""` の中に、コピーしたURLを貼り付けて保存します。

これで、ツールからMMQ番号を入れるだけでデータの呼び出しと追記（スプレッドシートへの直接反映）ができるようになります！
