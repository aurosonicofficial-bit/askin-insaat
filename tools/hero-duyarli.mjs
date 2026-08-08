/**
 * HERO GORSELI — DUYARLI BOYUTLAR  (9 Agu 2026)
 *
 * SORUN (olculdu): begendik-loft-hero 1920x1080 / 260 KB webp olarak
 * herkese ayni gidiyor. Oysa ekranda kapladigi alan:
 *     masaustu 515x420   mobil 343x230
 * Retina (2x) hesabiyla bile mobilde ~750 px yeterli. Yani telefondan
 * gelen ziyaretci 343 piksellik bir yer icin 260 KB indiriyor — ve
 * insaatta trafigin cogu mobil.
 *
 * COZUM: 3 genislik uret (760 / 1180 / 1920) ve <source srcset> ile
 * tarayiciya sectir. sizes, gercek yerlesim olculerinden yazildi:
 *   <=960px  -> tek sutun, kapsayici genisligi kadar (92vw)
 *   >960px   -> iki sutun, ~515px
 *
 * Orijinal 1920 dosyalar DURUYOR; en buyuk basamak olarak kullaniliyor.
 * <img src> hala .jpg — webp desteklemeyen tarayici icin yedek.
 */
import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'assets', 'images');
const UYGULA = process.argv.includes('--uygula');

const TABAN = 'begendik-loft-hero';
const BASAMAK = [760, 1180];          // 1920 zaten var
const KAYNAK = join(IMG, TABAN + '.jpg');

console.log('='.repeat(66));
console.log(`  HERO DUYARLI BOYUTLAR   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(66));

const kb = (p) => (statSync(p).size / 1024).toFixed(0);
console.log(`  kaynak: ${TABAN}.webp  1920 px  ${kb(join(IMG, TABAN + '.webp'))} KB`);

const uretilen = [];
for (const w of BASAMAK) {
  const hedef = join(IMG, `${TABAN}-${w}.webp`);
  if (existsSync(hedef)) {
    console.log(`  [VAR]  ${TABAN}-${w}.webp  ${kb(hedef)} KB`);
    uretilen.push(w); continue;
  }
  if (!UYGULA) { console.log(`  [YENI] ${TABAN}-${w}.webp uretilecek`); uretilen.push(w); continue; }
  await sharp(KAYNAK).resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 78 }).toFile(hedef);
  console.log(`  [OK]   ${TABAN}-${w}.webp  ${kb(hedef)} KB`);
  uretilen.push(w);
}

// --- index.html'deki <source>'u srcset'e cevir ---
const yol = join(ROOT, 'index.html');
let h = readFileSync(yol, 'utf8');

const ESKI = `<source srcset="assets/images/${TABAN}.webp" type="image/webp">`;
const YENI =
  `<source type="image/webp"\n` +
  `          srcset="assets/images/${TABAN}-760.webp 760w,\n` +
  `                  assets/images/${TABAN}-1180.webp 1180w,\n` +
  `                  assets/images/${TABAN}.webp 1920w"\n` +
  `          sizes="(max-width:960px) 92vw, 515px">`;

if (h.includes(`${TABAN}-760.webp`)) {
  console.log('\n  index.html ZATEN srcset kullaniyor');
} else if (!h.includes(ESKI)) {
  console.log('\n  [HATA] index.html icinde beklenen <source> bulunamadi');
} else {
  if (UYGULA) {
    if (!existsSync(yol + '.bak-srcset')) copyFileSync(yol, yol + '.bak-srcset');
    writeFileSync(yol, h.replace(ESKI, YENI), 'utf8');
    console.log('\n  index.html: <source srcset> yazildi');
  } else {
    console.log('\n  index.html: <source srcset> yazilacak');
  }
}

if (!UYGULA) console.log('\n  --uygula ile calistir.');
