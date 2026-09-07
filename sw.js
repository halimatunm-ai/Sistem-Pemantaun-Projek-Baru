const CACHE_NAME = 'pwa-PKDLMS-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});/**
 * ============================================================
 *  PAPAN PEMUKA PEMANTAUAN PROJEK — BACKEND (Code.gs)
 * ============================================================
 *  Data dibaca terus daripada fail Google Sheets.
 * ============================================================
 */

var SPREADSHEET_ID = '1DBxaY4Zf08CVZtKgRVHqHlT-N8R_EyqSTWsmU-SK5zw';

var COLUMN_KEYS = [
  'no',                    // 1
  'jenisPeruntukan',       // 2
  'fasiliti',              // 3
  'namaProjek',            // 4
  'lokasiFasiliti',        // 5
  'kaedahPerolehan',       // 6
  'silingPeruntukan',      // 7
  'gredKontraktor',        // 8
  'peringkatSemasa',       // 9
  'hargaKontraktor',       // 10
  'bakiAsal',              // 11
  'perubahanKerja',        // 12
  'hargaMuktamad',         // 13
  'namaKontraktor',        // 14
  'tempohKerja',           // 15
  'tarikhMula',            // 16
  'tarikhSiapAsal',        // 17
  'tarikhSiapSebenar',     // 18
  'kemajuanRancang',       // 19
  'kemajuanSebenar',       // 20
  'varian',                // 21
  'statusFizikal',         // 22
  'bakiAkhir',             // 23
  'peratusBelumTanggung',  // 24
  'tanggung',              // 25
  'peratusTanggung',       // 26
  'belanja',               // 27
  'peratusBelanja',        // 28
  'catatan',               // 29
  'catatanKerja'           // 30
];

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Papan Pemuka Pemantauan Projek')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getProjectData() {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID belum ditetapkan.');
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0]; 
    var rows = sheet.getDataRange().getDisplayValues(); 
    
    var file = DriveApp.getFileById(SPREADSHEET_ID);
    var lastUpdated = file.getLastUpdated();

    var records = [];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var isBlank = row.every(function (cell) {
        return String(cell).trim() === '';
      });
      if (isBlank) continue;

      var firstCell = String(row[0]).trim();
      var noValue = parseInt(firstCell, 10);
      if (isNaN(noValue) || String(noValue) !== firstCell.replace(/^0+(?=\d)/, '')) continue; 

      var obj = {};
      for (var c = 0; c < COLUMN_KEYS.length; c++) {
        obj[COLUMN_KEYS[c]] = row[c] !== undefined ? String(row[c]).trim() : '';
      }
      records.push(obj);
    }

    return {
      data: records,
      lastUpdated: Utilities.formatDate(lastUpdated, Session.getScriptTimeZone() || 'Asia/Kuala_Lumpur', 'dd/MM/yyyy HH:mm:ss'),
      error: null
    };
  } catch (err) {
    return {
      data: [],
      lastUpdated: null,
      error: err.message
    };
  }
}
