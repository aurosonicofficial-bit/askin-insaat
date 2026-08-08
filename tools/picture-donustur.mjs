/**
 * <img> -> <picture> DONUSTURUCU  (8 Agu 2026)
 *
 * SORUN (olculdu): main.js webp yukseltmesini DOMContentLoaded'da yapiyor.
 * Tarayici o ana kadar HTML'deki src'den JPG/PNG'yi ZATEN indirmeye
 * baslamis olur, sonra JS ayni gorseli bir de .webp olarak indirir.
 * Sonuc: her gorsel IKI KEZ iniyor (20 sayfa toplaminda ~28.6 MB fazla).
 *
 * COZUM: <picture> + <source type="image/webp">. Tarayici DAHA ISTEK
 * ATMADAN webp'yi secer, JPG'yi hic indirmez. Eski tarayicida <img>
 * yedegi devreye girer.
 *
 * GUVENLIK:
 *   - Sadece webp KARSILIGI OLAN gorseller donusturulur
 *   - Zaten <picture> icindeyse atlanir (tekrar calistirmak guvenli)
 *   - <img> etiketinin TUM nitelikleri aynen korunur
 *   - Donusum icin CSS'e picture{display:contents} eklenmeli (ayrica yapildi)
 *
 * CALISTIRMA:
 *   node tools/picture-donustur.mjs          -> KURU CALISTIRMA (yazmaz)
 *   node tools/picture-donustur.mjs --uygula -> yazar
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UYGULA = process.argv.includes('--uygula');

const sayfalar = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

let topDonusen = 0, topAtlanan = 0, topWebpYok = 0;
const rapor = [];

for (const sayfa of sayfalar) {
  const yol = join(ROOT, sayfa);
  let html = readFileSync(yol, 'utf8');
  let donusen = 0, webpYok = 0, zaten = 0;

  // <img ...> etiketlerini bul (kendi kendine kapanan da olabilir)
  html = html.replace(/<img\b[^>]*>/gi, (etiket, konum) => {
    // zaten <picture> icinde mi? (etiketten onceki 220 karaktere bak)
    const onceki = html.slice(Math.max(0, konum - 220), konum);
    if (/<picture\b[^>]*>(?:(?!<\/picture>)[\s\S])*$/i.test(onceki)) {
      zaten++; return etiket;
    }

    const m = etiket.match(/\ssrc="([^"]+)"/i);
    if (!m) return etiket;
    const src = m[1];

    const i = src.indexOf('assets/images/');
    if (i === -1) return etiket;
    const rel = src.slice(i);
    if (!/\.(jpe?g|png)$/i.test(rel)) return etiket;

    const webpRel = rel.replace(/\.(jpe?g|png)$/i, '.webp');
    if (!existsSync(join(ROOT, webpRel.split('/').join('\\')))) {
      webpYok++; return etiket;
    }

    // src'deki yol onekini koru (bazi sayfalarda ../ olabilir)
    const onek = src.slice(0, i);
    donusen++;
    return `<picture><source srcset="${onek}${webpRel}" type="image/webp">${etiket}</picture>`;
  });

  if (donusen && UYGULA) {
    if (!existsSync(yol + '.bak-picture')) copyFileSync(yol, yol + '.bak-picture');
    writeFileSync(yol, html, 'utf8');
  }

  topDonusen += donusen; topAtlanan += zaten; topWebpYok += webpYok;
  if (donusen || webpYok || zaten) rapor.push([sayfa, donusen, webpYok, zaten]);
}

console.log('='.repeat(70));
console.log(`  <img> -> <picture>   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA (yazilmadi)'}`);
console.log('='.repeat(70));
console.log(`  ${'SAYFA'.padEnd(34)} ${'donusen'.padStart(8)} ${'webp yok'.padStart(9)} ${'zaten'.padStart(6)}`);
console.log('  ' + '-'.repeat(62));
for (const [s, d, w, z] of rapor.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${s.slice(0, 34).padEnd(34)} ${String(d).padStart(8)} ${String(w).padStart(9)} ${String(z).padStart(6)}`);
}
console.log();
console.log(`  TOPLAM donusen : ${topDonusen}`);
console.log(`  webp'i yok     : ${topWebpYok}`);
console.log(`  zaten picture  : ${topAtlanan}`);
if (!UYGULA) console.log('\n  Liste dogruysa --uygula ile calistir.');
