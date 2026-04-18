/**
 * ==========================================
 * MQ Management System v12.0
 * Orders Master + Dual Sheet Mapping
 * ==========================================
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('MQ\u30e1\u30cb\u30e5\u30fc')
    .addItem('\ud83d\udcc2 Orders\u304b\u3089\u547c\u3073\u51fa\u3057',
        'fetchFromOrders')
    .addItem('\ud83d\udcc1 Orders\u3078\u4fdd\u5b58', 'syncToOrders')
    .addSeparator()
    .addItem('\u2699 Orders\u306b\u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u8a2d\u5b9a',
        'setupOrdersDropdown')
    .addToUi();
}

/**
 * Form Cell Map (Morimoto 1)
 */
var FORM = {
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
  amount:   'I47'
};

/**
 * Form Cell Map (Morimoto 2 - different layout)
 */
var FORM2 = {
  id:       'B1',
  addr:     'C6',
  name:     'C8',
  tel:      'F8',
  content:  'B13',
  worker:   'B15'
};

/**
 * Orders Column Index (1-based)
 * A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8,
 * I=9, J=10, K=11, L=12, M=13, N=14, O=15
 */
var ORD = {
  id:1, date:2, mqStaff:3, worker:4,
  name:5, tel:6, addr:7, mansion:8,
  room:9, content:10, amount:11, remarks:12,
  company:13, staffTel:14, billingDest:15
};

var FIXED_COMPANY   = '\u30ab\u30fc\u30ed\u30c3\u30af\u30db\u30fc\u30e0\u30ba\u682a\u5f0f\u4f1a\u793e';
var FIXED_STAFF_TEL = '03-5311-0556';

/* Lookup address from Property Master */
function lookupAddress(ss, mansionName) {
  var master = ss.getSheetByName('\u7269\u4ef6\u30de\u30b9\u30bf');
  if (!master || !mansionName) return '';
  var data = master.getDataRange().getValues();
  var search = String(mansionName).trim();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === search) return data[i][1];
  }
  return '';
}

/* Populate Morimoto 2 from Morimoto 1 */
function populateSheet2(s1, s2) {
  s2.getRange(FORM2.id).setValue(s1.getRange(FORM.id).getValue());
  s2.getRange(FORM2.addr).setValue(s1.getRange(FORM.address).getValue());
  s2.getRange(FORM2.name).setValue(s1.getRange(FORM.name).getValue());
  s2.getRange(FORM2.tel).setValue(s1.getRange(FORM.nameTel).getValue());
  s2.getRange(FORM2.content).setValue(s1.getRange(FORM.content).getValue());
  s2.getRange(FORM2.worker).setValue(s1.getRange(FORM.staff).getValue());
}

/* Auto Engine (onEdit trigger) */
function onEdit(e) {
  if (!e) return;
  var sheet = e.source.getActiveSheet();
  var sn = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var val = e.range.getValue();

  if (sn === 'Orders' && col === 8 && row > 1) {
    var addr = lookupAddress(e.source, val);
    sheet.getRange(row, 7).setValue(addr);
    SpreadsheetApp.flush();
    return;
  }

  if (sn.indexOf('\u30e2\u30ea\u30e2\u30c8') >= 0) {
    if (col === 8 && row === 11) {
      var addr2 = val ? lookupAddress(e.source, val) : '';
      sheet.getRange('H9').setValue(addr2);
      SpreadsheetApp.flush();
    }
    if (sn.indexOf('\u2460') >= 0) {
      var sheets = e.source.getSheets();
      for (var s = 0; s < sheets.length; s++) {
        if (sheets[s].getName().indexOf('\u2461') >= 0) {
          populateSheet2(sheet, sheets[s]);
          break;
        }
      }
    }
  }
}

/* Find sheet by partial name */
function findSheet(ss, kw1, kw2) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var n = sheets[i].getName();
    if (n.indexOf(kw1) >= 0 && n.indexOf(kw2) >= 0) return sheets[i];
  }
  return null;
}

/* Fetch from Orders -> Morimoto 1 & 2 */
function fetchFromOrders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var res = ui.prompt('\ud83d\udcc2 \u6848\u4ef6\u547c\u3073\u51fa\u3057',
      '\u6848\u4ef6\u756a\u53f7\u3092\u5165\u529b\uff08\u4f8b: MMQ335\uff09',
      ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;

  var inputId = res.getResponseText().trim().toUpperCase();
  if (!inputId) {
    ui.alert('\u6848\u4ef6\u756a\u53f7\u304c\u5165\u529b\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002');
    return;
  }

  var orders = ss.getSheetByName('Orders');
  if (!orders) {
    ui.alert('Orders\u30b7\u30fc\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');
    return;
  }

  var data = orders.getDataRange().getValues();
  var r = null;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === inputId) {
      r = data[i]; break;
    }
  }
  if (!r) {
    ui.alert('\u300c' + inputId + '\u300d\u306f\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002');
    return;
  }

  var s1 = findSheet(ss, '\u30e2\u30ea\u30e2\u30c8', '\u2460');
  if (!s1) {
    ui.alert('\u30e2\u30ea\u30e2\u30c8\u2460\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');
    return;
  }

  // Morimoto 1
  s1.getRange(FORM.id).setValue('\u53d7\u4ed8No. ' + r[ORD.id - 1]);
  s1.getRange(FORM.date).setValue(r[ORD.date - 1]);
  s1.getRange(FORM.staff).setValue(r[ORD.mqStaff - 1]);
  s1.getRange(FORM.name).setValue(r[ORD.name - 1]);
  s1.getRange(FORM.nameTel).setValue(r[ORD.tel - 1]);
  s1.getRange(FORM.address).setValue(r[ORD.addr - 1]);

  var mc = s1.getRange(FORM.mansion);
  mc.clearDataValidations();
  mc.setValue(r[ORD.mansion - 1]);

  s1.getRange(FORM.room).setValue(r[ORD.room - 1]);
  s1.getRange(FORM.content).setValue(r[ORD.content - 1]);
  s1.getRange(FORM.amount).setValue(r[ORD.amount - 1]);
  s1.getRange(FORM.billing).setValue(r[ORD.billingDest - 1] || '');

  // Fixed values
  s1.getRange(FORM.company).setValue(FIXED_COMPANY);
  s1.getRange(FORM.staffTel).setValue(FIXED_STAFF_TEL);

  // Morimoto 2
  var s2 = findSheet(ss, '\u30e2\u30ea\u30e2\u30c8', '\u2461');
  if (s2) {
    s2.getRange(FORM2.id).setValue('\u53d7\u4ed8No. ' + r[ORD.id - 1]);
    s2.getRange(FORM2.addr).setValue(r[ORD.addr - 1]);
    s2.getRange(FORM2.name).setValue(r[ORD.name - 1]);
    s2.getRange(FORM2.tel).setValue(r[ORD.tel - 1]);
    s2.getRange(FORM2.content).setValue(r[ORD.content - 1]);
    s2.getRange(FORM2.worker).setValue(r[ORD.worker - 1] || '');
  }

  SpreadsheetApp.flush();
  ss.toast('\u2705 ' + r[0] + ' \u3092\u2460\u2461\u306b\u53cd\u6620\u3057\u307e\u3057\u305f', '\u5b8c\u4e86', 5);
}

/* Save Morimoto 1 -> Orders */
function syncToOrders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var s1 = findSheet(ss, '\u30e2\u30ea\u30e2\u30c8', '\u2460');
  if (!s1) { ui.alert('\u30e2\u30ea\u30e2\u30c8\u2460\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002'); return; }
  var orders = ss.getSheetByName('Orders');
  if (!orders) { ui.alert('Orders\u30b7\u30fc\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002'); return; }

  var rawId = String(s1.getRange(FORM.id).getValue());
  var m = rawId.match(/MMQ[A-Z0-9]+/i);
  var id = m ? m[0].toUpperCase().trim() : '';
  if (!id) { ui.alert('\u6848\u4ef6\u756a\u53f7\u304c\u8aad\u307f\u53d6\u308c\u307e\u305b\u3093\u3002'); return; }

  var v = {
    date: s1.getRange(FORM.date).getValue(),
    staff: s1.getRange(FORM.staff).getValue(),
    name: s1.getRange(FORM.name).getValue(),
    tel: s1.getRange(FORM.nameTel).getValue(),
    addr: s1.getRange(FORM.address).getValue(),
    mansion: s1.getRange(FORM.mansion).getValue(),
    room: s1.getRange(FORM.room).getValue(),
    content: s1.getRange(FORM.content).getValue(),
    amount: s1.getRange(FORM.amount).getValue(),
    company: s1.getRange(FORM.company).getValue(),
    staffTel: s1.getRange(FORM.staffTel).getValue(),
    billing: s1.getRange(FORM.billing).getValue()
  };

  var data = orders.getDataRange().getValues();
  var tr = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === id) { tr = i + 1; break; }
  }

  if (tr > 0) {
    orders.getRange(tr, ORD.date).setValue(v.date);
    orders.getRange(tr, ORD.mqStaff).setValue(v.staff);
    orders.getRange(tr, ORD.name).setValue(v.name);
    orders.getRange(tr, ORD.tel).setValue(v.tel);
    orders.getRange(tr, ORD.addr).setValue(v.addr);
    orders.getRange(tr, ORD.mansion).setValue(v.mansion);
    orders.getRange(tr, ORD.room).setValue(v.room);
    orders.getRange(tr, ORD.content).setValue(v.content);
    orders.getRange(tr, ORD.amount).setValue(v.amount);
    orders.getRange(tr, ORD.company).setValue(v.company);
    orders.getRange(tr, ORD.staffTel).setValue(v.staffTel);
    orders.getRange(tr, ORD.billingDest).setValue(v.billing);
    ui.alert('\u2705 ' + id + ' \u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\uff01');
  } else {
    orders.appendRow([id, v.date, v.staff, '', v.name, v.tel,
      v.addr, v.mansion, v.room, v.content, v.amount, '',
      v.company, v.staffTel, v.billing]);
    ui.alert('\u2705 ' + id + ' \u3092\u65b0\u898f\u8ffd\u52a0\u3057\u307e\u3057\u305f\uff01');
  }
}

/* Setup Dropdown */
function setupOrdersDropdown() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orders = ss.getSheetByName('Orders');
  var master = ss.getSheetByName('\u7269\u4ef6\u30de\u30b9\u30bf');
  if (!orders || !master) {
    SpreadsheetApp.getUi().alert('\u30b7\u30fc\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002');
    return;
  }
  var lr = master.getLastRow();
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(master.getRange('A2:A' + lr))
    .setAllowInvalid(true).build();
  orders.getRange('H2:H200').setDataValidation(rule);
  SpreadsheetApp.getUi().alert('\u2705 \u30c9\u30ed\u30c3\u30d7\u30c0\u30a6\u30f3\u3092\u8a2d\u5b9a\u3057\u307e\u3057\u305f\uff01');
}
