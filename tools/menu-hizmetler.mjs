/**
 * MENUYE "HIZMETLER" ACILIR LISTESI  (9 Agu 2026)
 *
 * SORUN (kullanici yakaladi): tadilat-fiyatlari.html ve
 * mantolama-cephe-yalitimi.html yazildi ama HICBIR YERDEN LINK YOKTU.
 * Olculdu: ikisine de 0 link, menude de yoklar. Sadece adresi bilen
 * girebiliyordu — ne ziyaretci bulur ne Google tarar.
 *
 * COZUM: menuye "Hizmetler" acilir listesi. Ust seviye madde sayisi
 * ARTMIYOR (Celik Ev Modelleri iceri tasiniyor). Sira kullanicinin is
 * onceligi: tadilat > mantolama > celik > kat karsiligi > havuz.
 *
 * ⚠ IKI TUZAK:
 *   1) HTML dosyalari CRLF satir sonu kullaniyor -> "\\n" iceren sabit
 *      kalip HICBIR sayfada eslesmez.
 *   2) nav markup'i sayfadan sayfaya DEGISIYOR: bazisinda
 *      <a href="...">, bazisinda <a class="" href="...">, girintiler farkli.
 *   Bu yuzden sabit metin yerine ONCE nav blogu bulunur, SONRA blok
 *   icinde regex ile hedef link degistirilir. Footer'daki ayni link
 *   nav blogunun disinda kaldigi icin dokunulmaz.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
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

// nav blogu icinde celik-ev-modelleri linkini yakala (class'li veya class'siz)
const NAV_BLOK = /(<nav class="main-nav"[^>]*>)([\s\S]*?)(<\/nav>)/;
const HEDEF_LINK = /<a\b[^>]*href="celik-ev-modelleri\.html"[^>]*>[^<]*<\/a>/;

console.log('='.repeat(64));
console.log(`  MENUYE HIZMETLER LISTESI   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(64));

let n = 0, atlanan = 0, hata = 0;
for (const f of readdirSync(ROOT).filter(x => x.endsWith('.html')).sort()) {
  const p = join(ROOT, f);
  let h = readFileSync(p, 'utf8');

  if (h.includes('data-drop')) { atlanan++; continue; }

  const m = h.match(NAV_BLOK);
  if (!m) { console.log(`  [NAV YOK]  ${f}`); hata++; continue; }
  if (!HEDEF_LINK.test(m[2])) { console.log(`  [LINK YOK] ${f}`); hata++; continue; }

  const yeniNav = m[1] + m[2].replace(HEDEF_LINK, DROP) + m[3];
  h = h.replace(NAV_BLOK, () => yeniNav);
  if (UYGULA) writeFileSync(p, h, 'utf8');
  n++;
}
console.log(`  guncellenen: ${n}   zaten yapilmis: ${atlanan}   sorunlu: ${hata}`);
if (!UYGULA) console.log('\n  --uygula ile calistir.');
