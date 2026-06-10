/**
 * i18n "chrome" uygulayıcı — ortak başlık/menü/altbilgi öğelerine data-i18n,
 * topbar'a dil değiştirici ve i18n.js script'ini ekler.
 *
 * Sayfaya özgü gövde içeriği AYRICA elle data-i18n ile işaretlenir; bu script
 * yalnız tüm sayfalarda aynı olan kısımları (topbar, nav, footer) ele alır.
 * Idempotent: zaten uygulanmışsa (langToggle varsa) atlar.
 *
 * ÇALIŞTIRMA: node tools/i18n-apply-chrome.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// index.html zaten elle yapıldı; diğer tüm sayfalara ortak chrome uygulanır
// (proje detay / rapor sayfalarının gövdesi şimdilik Türkçe kalır — başlık/menü
// yine de çevrilir ve dil değiştirici tutarlı şekilde her sayfada görünür).
const PAGES = readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .sort();

const SWITCHER = `<div class="right" style="display:flex;align-items:center;gap:16px;">
      <span data-i18n="topbar_locations">Türkiye · Birleşik Krallık</span>
      <div class="lang-switcher">
        <button class="lang-btn" id="langToggle">
          <span id="currentFlag">🇹🇷</span>
          <span id="currentLang">TR</span>
          <span>▾</span>
        </button>
        <div class="lang-dropdown" id="langDropdown">
          <a href="#" data-lang="tr" class="active"><span class="lang-flag">🇹🇷</span> Türkçe</a>
          <a href="#" data-lang="en"><span class="lang-flag">🇬🇧</span> English</a>
          <a href="#" data-lang="de"><span class="lang-flag">🇩🇪</span> Deutsch</a>
          <a href="#" data-lang="fr"><span class="lang-flag">🇫🇷</span> Français</a>
          <a href="#" data-lang="it"><span class="lang-flag">🇮🇹</span> Italiano</a>
          <a href="#" data-lang="es"><span class="lang-flag">🇪🇸</span> Español</a>
          <a href="#" data-lang="ar"><span class="lang-flag">🇸🇦</span> العربية</a>
          <a href="#" data-lang="ru"><span class="lang-flag">🇷🇺</span> Русский</a>
        </div>
      </div>
    </div>`;

// href -> nav anahtarı (hem header menüsü hem footer "Hızlı Menü" linkleri)
const NAV = {
  'kurumsal.html': 'nav_corporate',
  'faaliyet-alanlari.html': 'nav_services',
  'projeler.html': 'nav_projects',
  'celik-ev-modelleri.html': 'nav_steel',
  'medya-merkezi.html': 'nav_media',
  'uluslararasi-vizyon.html': 'nav_international',
  'iletisim.html': 'nav_contact',
};
const NAV_LABEL = {
  'kurumsal.html': 'Kurumsal',
  'faaliyet-alanlari.html': 'Faaliyet Alanları',
  'projeler.html': 'Projeler',
  'celik-ev-modelleri.html': 'Çelik Ev Modelleri',
  'medya-merkezi.html': 'Medya Merkezi',
  'uluslararasi-vizyon.html': 'Uluslararası Vizyon',
  'iletisim.html': 'İletişim',
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let done = 0;
for (const page of PAGES) {
  const path = join(ROOT, page);
  let html;
  try { html = readFileSync(path, 'utf8'); } catch { console.log(`atlandı (yok): ${page}`); continue; }
  if (html.includes('id="langToggle"')) { console.log(`atlandı (zaten var): ${page}`); continue; }

  // 1) topbar hizmetler span
  html = html.replace(
    '<span>İnşaat · Yapı · Mimarlık · Müteahhitlik</span>',
    '<span data-i18n="topbar_services">İnşaat · Yapı · Mimarlık · Müteahhitlik</span>'
  );

  // 2) topbar sağ -> dil değiştirici
  html = html.replace(
    '<div class="right"><span>Türkiye · Birleşik Krallık</span></div>',
    SWITCHER
  );

  // 3) nav + footer menü linkleri (class değişebilir; href'e göre)
  for (const [href, key] of Object.entries(NAV)) {
    const label = NAV_LABEL[href];
    const re = new RegExp(`(<a\\b[^>]*href="${esc(href)}"[^>]*?)>${esc(label)}</a>`, 'g');
    html = html.replace(re, `$1 data-i18n="${key}">${label}</a>`);
  }

  // 4) CTA "Teklif Talebi" (header'da mobil + masaüstü)
  html = html.replace(/(<a\b[^>]*?)>Teklif Talebi<\/a>/g, '$1 data-i18n="cta">Teklif Talebi</a>');

  // 5) footer açıklama paragrafı
  html = html.replace(
    '<p>Aşkın İnşaat Mimarlık Yapı; konut, ticari yapı, çelik sistem, proje geliştirme ve uygulama süreçlerini tek çatı altında yöneten kurumsal bir yapıdır.</p>',
    '<p data-i18n="footer_desc">Aşkın İnşaat Mimarlık Yapı; konut, ticari yapı, çelik sistem, proje geliştirme ve uygulama süreçlerini tek çatı altında yöneten kurumsal bir yapıdır.</p>'
  );

  // 6) footer başlıkları
  html = html.replace('<h4>Hızlı Menü</h4>', '<h4 data-i18n="footer_menu">Hızlı Menü</h4>');
  html = html.replace('<h4>İletişim</h4>', '<h4 data-i18n="footer_contact">İletişim</h4>');

  // 7) copyright
  html = html.replace(
    '<div class="copyright">© 2025 Aşkın İnşaat Mimarlık Yapı. Tüm hakları saklıdır.</div>',
    '<div class="copyright" data-i18n="footer_copy">© 2025 Aşkın İnşaat Mimarlık Yapı. Tüm hakları saklıdır.</div>'
  );

  // 8) i18n.js script'i (main.js'ten sonra; yoksa </body>'den önce)
  if (html.includes('assets/js/main.js')) {
    html = html.replace(
      /(<script src="assets\/js\/main\.js"><\/script>)/,
      '$1\n<script src="assets/js/i18n.js"></script>'
    );
  } else {
    html = html.replace('</body>', '<script src="assets/js/i18n.js"></script>\n</body>');
  }

  writeFileSync(path, html, 'utf8');
  done++;
  console.log(`✓ ${page}`);
}
console.log(`\nUygulanan sayfa: ${done}/${PAGES.length}`);
