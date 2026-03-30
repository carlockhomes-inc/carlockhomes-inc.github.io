/**
 * ==========================================
 * MQ\u696d\u52d9\u7ba1\u7406\u30b7\u30b9\u30c6\u30e0 v11.1
 * Orders\u30de\u30b9\u30bf\u30fc + \u5168\u30d5\u30a3\u30fc\u30eb\u30c9\u5b8c\u5168\u540c\u671f
 * ==========================================
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('MQ\u30e1\u30cb\u30e5\u30fc')
    .addItem('\ud83d\udcc2 Orders\u304b\u3089\u547c\u3073\u51fa\u3057', 'fetchFromOrders')
    .addItem('\ud83d\udcbe Orders\u3078\u4fdd\u5b58', 'syncToOrders')
    .addSeparator()
    .addItem('\u2699 Orders\u306b\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u8a2d\u5b9a', 'setupOrdersDropdown')
    .addToUi();
}

/**
 * \u30e2\u30ea\u30e2\u30c8\u2460\u306e\u30bb\u30eb\u4f4d\u7f6e\u30de\u30c3\u30d7\uff08\u78ba\u8a8d\u6e08\u307f\uff09
 */
const FORM = {
  id:       'B1',
  date:     'H4',
  company:  'AA4',
  staff:    'H6',
  staffTel: 'AE6',
  address:  'H9',
  mansion:  'H11',
  room:     'AE11',
  name:     'H13',
  nameTel:  'AE13',
  billing:  'H18',
  content:  'B22',
  amount:   'I47',
};

/**
 * Orders\u5217\u756a\u53f7 (1\u59cb\u307e\u308a)
 * A=1\u6848\u4ef6\u756a\u53f7, B=2\u53d7\u4ed8\u65e5, C=3MQ\u62c5\u5f53\u8005, D=4\u4f5c\u696d\u62c5\u5f53\u8005,
 * E=5\u304a\u5ba2\u69d8\u540d, F=6\u9023\u7d61\u5148, G=7\u4f4f\u6240, H=8\u30de\u30f3\u30b7\u30e7\u30f3\u540d,
 * I=9\u90e8\u5c4b\u756a\u53f7, J=10\u4f9d\u983c\u5185\u5bb9, K=11\u5408\u8a08\u91d1\u984d, L=12\u5099\u8003,
 * M=13\u793e\u540d, N=14\u62c5\u5f53\u8005\u9023\u7d61\u5148, O=15\u8acb\u6c42\u5148
 */
const ORD = {
  id:1, date:2, mqStaff:3, worker:4, name:5, tel:6, addr:7, mansion:8,
  room:9, content:10, amount:11, remarks:12,
  company:13, staffTel:14, billingDest:15
};

/**
 * \u7269\u4ef6\u30de\u30b9\u30bf\u304b\u3089\u4f4f\u6240\u691c\u7d22
 */
function lookupAddress(ss, mansionName) {
  const master = ss.getSheetByName('\u7269\u4ef6\u30de\u30b9\u30bf');
  if (!master || !mansionName) return '';
  const data = master.getDataRange().getValues();
  const search = String(mansionName).trim();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === search) return data[i][1];
  }
  return '';
}

/**
 * \u2460\u306e\u30c7\u30fc\u30bf\u3092\u2461\u306b\u30df\u30e9\u30fc\u30ea\u30f3\u30b0
 */
function mirror1to2(s1, s2) {
  const keys = Object.keys(FORM);
  keys.forEach(k => {
    s2.getRange(FORM[k]).setValue(s1.getRange(FORM[k]).getValue());
  });
}

/**
 * \u81ea\u52d5\u30a8\u30f3\u30b8\u30f3 (onEdit\u30c8\u30ea\u30ac\u30fc)
 */
function onEdit(e) {
  if (!e) return;
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  const row = e.range.getRow();
  const col = e.range.getColumn();
  const val = e.range.getValue();

  if (sheetName === 'Orders' && col === ORD.mansion && row > 1) {
    const addr = lookupAddress(e.source, val);
    sheet.getRange(row, ORD.addr).setValue(addr);
    SpreadsheetApp.flush();
    return;
  }

  if (sheetName.includes('\u30e2\u30ea\u30e2\u30c8')) {
    if (col === 8 && row === 11) {
      sheet.getRange(FORM.address).setValue(val ? lookupAddress(e.source, val) : '');
      SpreadsheetApp.flush();
    }
    if (sheetName.includes('\u2460')) {
      const s2 = e.source.getSheets().find(s => s.getName().includes('\u30e2\u30ea\u30e2\u30c8') && s.getName().includes('\u2461'));
      if (s2) mirror1to2(sheet, s2);
    }
  }
}

/**
 * Orders\u304b\u3089\u30e2\u30ea\u30e2\u30c8\u2460\u2461\u3078\u547c\u3073\u51fa\u3057
 */
function fetchFromOrders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('\ud83d\udcc2 \u6848\u4ef6\u547c\u3073\u51fa\u3057',
    '\u6848\u4ef6\u756a\u53f7\u3092\u5165\u529b\uff08\u4f8b: MMQ335\uff09',
    ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;

  const inputId = res.getResponseText().trim().toUpperCase();
  if (!inputId) return ui.alert('\u6848\u4ef6\u756a\u53f7\u304c\u5165\u529b\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002');

  const orders = ss.getSheetByName('Orders');
  if (!orders) return ui.alert('Orders\u30b7\u30fc\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');

  const data = orders.getDataRange().getValues();
  const row = data.find(r => String(r[0]).trim().toUpperCase() === inputId);
  if (!row) return ui.alert('\u300c' + inputId + '\u300d\u306f\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002');

  const s1 = ss.getSheets().find(s => s.getName().includes('\u30e2\u30ea\u30e2\u30c8') && s.getName().includes('\u2460'));
  if (!s1) return ui.alert('\u30e2\u30ea\u30e2\u30c8\u2460\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');

  // === Orders -> Form: ALL fields ===
  s1.getRange(FORM.id).setValue('\u53d7\u4ed8No. ' + row[ORD.id - 1]);
  s1.getRange(FORM.date).setValue(row[ORD.date - 1]);
  s1.getRange(FORM.staff).setValue(row[ORD.mqStaff - 1]);
  s1.getRange(FORM.name).setValue(row[ORD.name - 1]);
  s1.getRange(FORM.nameTel).setValue(row[ORD.tel - 1]);
  s1.getRange(FORM.address).setValue(row[ORD.addr - 1]);

  const mansionCell = s1.getRange(FORM.mansion);
  mansionCell.clearDataValidations();
  mansionCell.setValue(row[ORD.mansion - 1]);

  s1.getRange(FORM.room).setValue(row[ORD.room - 1]);
  s1.getRange(FORM.content).setValue(row[ORD.content - 1]);
  s1.getRange(FORM.amount).setValue(row[ORD.amount - 1]);
  s1.getRange(FORM.company).setValue(row[ORD.company - 1] || '');
  s1.getRange(FORM.staffTel).setValue(row[ORD.staffTel - 1] || '');
  s1.getRange(FORM.billing).setValue(row[ORD.billingDest - 1] || '');

  // Mirror to sheet 2
  const s2 = ss.getSheets().find(s => s.getName().includes('\u30e2\u30ea\u30e2\u30c8') && s.getName().includes('\u2461'));
  if (s2) mirror1to2(s1, s2);

  SpreadsheetApp.flush();
  ss.toast('\u2705 ' + row[0] + ' \u3092\u2460\u2461\u306b\u53cd\u6620\u3057\u307e\u3057\u305f\uff01', '\u5b8c\u4e86', 5);
}

/**
 * \u30e2\u30ea\u30e2\u30c8\u2460\u306e\u5185\u5bb9\u3092Orders\u3078\u4fdd\u5b58
 */
function syncToOrders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const s1 = ss.getSheets().find(s => s.getName().includes('\u30e2\u30ea\u30e2\u30c8') && s.getName().includes('\u2460'));
  if (!s1) return ui.alert('\u30e2\u30ea\u30e2\u30c8\u2460\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');

  const orders = ss.getSheetByName('Orders');
  if (!orders) return ui.alert('Orders\u30b7\u30fc\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');

  const rawId = String(s1.getRange(FORM.id).getValue());
  const match = rawId.match(/MMQ[A-Z0-9]+/i);
  const id = match ? match[0].toUpperCase().trim() : '';
  if (!id) return ui.alert('\u6848\u4ef6\u756a\u53f7\u304c\u8aad\u307f\u53d6\u308c\u307e\u305b\u3093\u3002');

  // Read ALL fields from form
  const vals = {
    date:       s1.getRange(FORM.date).getValue(),
    staff:      s1.getRange(FORM.staff).getValue(),
    name:       s1.getRange(FORM.name).getValue(),
    tel:        s1.getRange(FORM.nameTel).getValue(),
    addr:       s1.getRange(FORM.address).getValue(),
    mansion:    s1.getRange(FORM.mansion).getValue(),
    room:       s1.getRange(FORM.room).getValue(),
    content:    s1.getRange(FORM.content).getValue(),
    amount:     s1.getRange(FORM.amount).getValue(),
    company:    s1.getRange(FORM.company).getValue(),
    staffTel:   s1.getRange(FORM.staffTel).getValue(),
    billingDest:s1.getRange(FORM.billing).getValue(),
  };

  const data = orders.getDataRange().getValues();
  let targetRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === id) { targetRow = i + 1; break; }
  }

  if (targetRow > 0) {
    // Update ALL columns
    orders.getRange(targetRow, ORD.date).setValue(vals.date);
    orders.getRange(targetRow, ORD.mqStaff).setValue(vals.staff);
    orders.getRange(targetRow, ORD.name).setValue(vals.name);
    orders.getRange(targetRow, ORD.tel).setValue(vals.tel);
    orders.getRange(targetRow, ORD.addr).setValue(vals.addr);
    orders.getRange(targetRow, ORD.mansion).setValue(vals.mansion);
    orders.getRange(targetRow, ORD.room).setValue(vals.room);
    orders.getRange(targetRow, ORD.content).setValue(vals.content);
    orders.getRange(targetRow, ORD.amount).setValue(vals.amount);
    orders.getRange(targetRow, ORD.company).setValue(vals.company);
    orders.getRange(targetRow, ORD.staffTel).setValue(vals.staffTel);
    orders.getRange(targetRow, ORD.billingDest).setValue(vals.billingDest);
    ui.alert('\u2705 ' + id + ' \u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\uff01');
  } else {
    // Append with ALL 15 columns
    orders.appendRow([
      id, vals.date, vals.staff, '',
      vals.name, vals.tel, vals.addr, vals.mansion,
      vals.room, vals.content, vals.amount, '',
      vals.company, vals.staffTel, vals.billingDest
    ]);
    ui.alert('\u2705 ' + id + ' \u3092\u65b0\u898f\u8ffd\u52a0\u3057\u307e\u3057\u305f\uff01');
  }
}

/**
 * Orders\u306eH\u5217\u306b\u30de\u30f3\u30b7\u30e7\u30f3\u540d\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u8a2d\u5b9a
 */
function setupOrdersDropdown() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const orders = ss.getSheetByName('Orders');
  const master = ss.getSheetByName('\u7269\u4ef6\u30de\u30b9\u30bf');
  if (!orders || !master) return SpreadsheetApp.getUi().alert('\u30b7\u30fc\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');
  const lastRow = master.getLastRow();
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(master.getRange('A2:A' + lastRow))
    .setAllowInvalid(true)
    .build();
  orders.getRange('H2:H200').setDataValidation(rule);
  SpreadsheetApp.getUi().alert('\u2705 Orders\u306eH\u5217\u306b\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u3092\u8a2d\u5b9a\u3057\u307e\u3057\u305f');
}
