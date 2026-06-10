/**
 * SEO + performans enjeksiyon scripti (idempotent).
 * Tüm .html dosyalarının <head>'ine OG/Twitter/canonical/JSON-LD ekler,
 * <img> etiketlerine loading="lazy" decoding="async" uygular (logo/hero hariç).
 *
 * Çalıştırma:  node tools/seo-inject.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://xn--akninaatmimarlk-8kcm72ffa.com';
const OG_IMAGE = `${BASE}/assets/images/begendik-loft-hero.jpg`;
const MARK = 'data-seo-injected';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Aşkın İnşaat Mimarlık Yapı',
  url: `${BASE}/`,
  image: OG_IMAGE,
  logo: `${BASE}/assets/images/logo.png`,
  telephone: '+905320606612',
  email: 'info@askininsaatmimarlik.com',
  description:
    'İnşaat, kat karşılığı, mimarlık, çelik sistem yapılar, havuz ve proje geliştirme alanlarında Türkiye ve Birleşik Krallık merkezli kurumsal hizmet.',
  priceRange: '₺₺₺',
  foundingDate: '2011',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'İsmetpaşa Mah., Burmalıçeşme Sok. 90/A',
      addressLocality: 'Dikili',
      addressRegion: 'İzmir',
      addressCountry: 'TR',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: '71–75 Shelton Street, Covent Garden',
      addressLocality: 'London',
      postalCode: 'WC2H 9JQ',
      addressCountry: 'GB',
    },
  ],
  geo: { '@type': 'GeoCoordinates', latitude: 39.0717, longitude: 26.8906 },
  areaServed: [
    { '@type': 'Country', name: 'Türkiye' },
    { '@type': 'Country', name: 'Birleşik Krallık' },
  ],
  knowsAbout: [
    'İnşaat', 'Kat Karşılığı İnşaat', 'Mimarlık', 'Çelik Sistem Yapı',
    'Hafif Çelik Ev', 'Havuz Projeleri', 'Proje Geliştirme', 'Müteahhitlik',
  ],
  sameAs: [],
};

const between = (s, a, b) => {
  const i = s.indexOf(a); if (i < 0) return '';
  const j = s.indexOf(b, i + a.length); if (j < 0) return '';
  return s.slice(i + a.length, j).trim();
};

const files = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let changed = 0;

for (const file of files) {
  const path = join(ROOT, file);
  let html = readFileSync(path, 'utf8');

  // --- img lazy-load (logo ve hero hariç) ---
  html = html.replace(/<img\s+([^>]*?)>/gi, (m, attrs) => {
    if (/loading\s*=/.test(attrs)) return m;
    if (/logo|-hero\./i.test(attrs)) return m; // LCP/üst görselleri eager bırak
    return `<img ${attrs.trim()} loading="lazy" decoding="async">`;
  });

  // --- SEO bloğu zaten varsa atla ---
  if (!html.includes(MARK)) {
    const title = between(html, '<title>', '</title>') || 'Aşkın İnşaat Mimarlık Yapı';
    const desc =
      between(html, 'name="description" content="', '"') ||
      'İnşaat, mimarlık, çelik sistem yapı ve proje geliştirme.';
    const canonical = file === 'index.html' ? `${BASE}/` : `${BASE}/${file}`;

    const block = `
<!-- ${MARK} -->
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta name="author" content="Aşkın İnşaat Mimarlık Yapı">
<meta name="geo.region" content="TR-35"><meta name="geo.placename" content="Dikili, İzmir">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Aşkın İnşaat Mimarlık Yapı">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">
<meta name="twitter:description" content="${desc.replace(/"/g, '&quot;')}">
<meta name="twitter:image" content="${OG_IMAGE}">
<link rel="icon" type="image/png" href="assets/images/logo.png">
<meta name="theme-color" content="#d6772a">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<!-- /seo -->
`;
    html = html.replace('</head>', `${block}</head>`);
    changed++;
  }

  writeFileSync(path, html, 'utf8');
}

console.log(`İşlendi: ${files.length} dosya, SEO eklenen: ${changed}`);
