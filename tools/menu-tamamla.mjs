/**
 * MENU TAMAMLAMA (9 Agu 2026) — menu-hizmetler.mjs'in birakigi iki is.
 *
 * 1) DORT SAYFA DISARIDA KALDI: basinda-biz, foto-video, medya-merkezi,
 *    raporlar. Bunlarin nav'i daha ESKI bir surum — icinde
 *    celik-ev-modelleri linki hic YOK, o yuzden degistirilecek bir sey
 *    bulunamadi. Bu sayfalarda acilir liste "Projeler"den SONRA eklenir.
 *
 * 2) MOBIL DOKUNUS JS'i: masaustunde acilir liste CSS hover/focus-within
 *    ile calisir, dokunmatikte calismaz. main.js'in SONUNA AYRI bir IIFE
 *    olarak eklenir — daha once mevcut blogun icine sokulmus ve
 *    "SyntaxError: Unexpected token ';'" vermisti. main.js CRLF kullaniyor,
 *    eklenen metin de CRLF'e cevrilir yoksa dosya karisik satir sonlu olur.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UYGULA = process.argv.includes('--uygula');

const DROP = `<div class="nav-drop" data-drop>
        <button type="button" class="nav-drop-btn" aria-expanded="false" data-i18n="nav_hizmetler">Hizmetler</button>
        <div class="nav-drop-menu">
          <a href="tadilat-fiyatlari.html" data-i18n="nav_tadilat">Tadilat ve Yenileme</a>
          <a href="mantolama-cephe-yalitimi.html" data-i18n="nav_mantolama">Mantolama ve Cephe</a>
          <a href="celik-ev-fiyatlari.html" data-i18n="nav_celik_fiyat">Çelik Ev Fiyatları</a>
          <a href="celik-ev-modelleri.html" data-i18n="nav_steel">Çelik Ev Modelleri</a>
          <a href="kat-karsiligi-insaat.html" data-i18n="nav_kk">Kat Karşılığı İnşaat</a>
          <a href="havuz-yapim-maliyeti.html" data-i18n="nav_havuz">Havuz Yapımı</a>
          <a href="hafif-celik-vs-betonarme.html" data-i18n="nav_karsilastirma">Çelik mi Betonarme mi?</a>
        </div>
      </div>`;

const NAV_BLOK = /(<nav class="main-nav"[^>]*>)([\s\S]*?)(<\/nav>)/;
const PROJELER = /(<a\b[^>]*href="projeler\.html"[^>]*>[^<]*<\/a>)/;

console.log('='.repeat(60));
console.log(`  MENU TAMAMLAMA   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(60));

let n = 0;
for (const f of readdirSync(ROOT).filter(x => x.endsWith('.html')).sort()) {
  const p = join(ROOT, f);
  let h = readFileSync(p, 'utf8');
  if (h.includes('data-drop')) continue;

  const m = h.match(NAV_BLOK);
  if (!m || !PROJELER.test(m[2])) { console.log(`  [ATLANDI] ${f}`); continue; }

  const yeni = m[1] + m[2].replace(PROJELER, `$1\r\n      ${DROP}`) + m[3];
  h = h.replace(NAV_BLOK, () => yeni);
  if (UYGULA) writeFileSync(p, h, 'utf8');
  console.log(`  [EKLENDI] ${f}`);
  n++;
}
console.log(`  eklenen sayfa: ${n}`);

// ── mobil dokunus JS'i ──────────────────────────────────────────
const JS = `

/* Hizmetler acilir listesi — mobil dokunus (9 Agu 2026).
   Masaustunde CSS hover/focus-within yeter; dokunmatikte hover yok.
   AYRI IIFE: mevcut blogun icine sokulursa main.js sozdizimi bozulur. */
(function () {
  function kapat(d) {
    d.classList.remove('open');
    var b = d.querySelector('.nav-drop-btn');
    if (b) b.setAttribute('aria-expanded', 'false');
  }
  function kur() {
    var ds = document.querySelectorAll('[data-drop]');
    for (var i = 0; i < ds.length; i++) {
      (function (d) {
        var btn = d.querySelector('.nav-drop-btn');
        if (!btn || btn.dataset.bagli) return;
        btn.dataset.bagli = '1';
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var acik = d.classList.toggle('open');
          btn.setAttribute('aria-expanded', acik ? 'true' : 'false');
        });
      })(ds[i]);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', kur);
  } else {
    kur();
  }
  document.addEventListener('click', function (e) {
    var ds = document.querySelectorAll('[data-drop].open');
    for (var i = 0; i < ds.length; i++) {
      if (!ds[i].contains(e.target)) kapat(ds[i]);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var ds = document.querySelectorAll('[data-drop].open');
    for (var i = 0; i < ds.length; i++) kapat(ds[i]);
  });
})();
`;

const PJ = join(ROOT, 'assets', 'js', 'main.js');
let j = readFileSync(PJ, 'utf8');
if (j.includes('data-drop')) {
  console.log('  main.js: JS zaten var');
} else if (UYGULA) {
  // main.js CRLF; eklenen metni de CRLF yap ki dosya karisik olmasin
  writeFileSync(PJ, j.replace(/\s*$/, '') + JS.replace(/\r?\n/g, '\r\n'), 'utf8');
  console.log('  main.js: mobil dokunus JS eklendi (dosya sonuna, ayri IIFE)');
} else {
  console.log('  main.js: JS eklenecek');
}
if (!UYGULA) console.log('\n  --uygula ile calistir.');
