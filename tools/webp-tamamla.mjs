/**
 * EKSIK WEBP TAMAMLAYICI  (8 Agu 2026)
 *
 * NEDEN: optimize-images.mjs sadece 400 KB USTU gorselleri isliyor
 * (MAX_BYTES esigi). Bu yuzden 280-340 KB araligindaki gorsellerin
 * (steel-villa-*, begendik-loft-angle, frame-11 ...) webp karsiligi
 * hic uretilmemis — olculdu: 31 gorselin sadece 14'unde webp vardi.
 *
 * BU SCRIPT ORIJINALLERE DOKUNMAZ. Sadece webp'si olmayanlarin
 * yanina .webp uretir. Yeniden calistirmak guvenlidir (var olani atlar).
 *
 * CALISTIRMA:  node tools/webp-tamamla.mjs
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'assets', 'images');
const MAX_W = 1920;      // optimize-images.mjs ile ayni
const KALITE = 78;       // optimize-images.mjs ile ayni

function walk(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    out = statSync(p).isDirectory() ? out.concat(walk(p)) : out.concat(p);
  }
  return out;
}

const hepsi = walk(IMG_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
const eksik = hepsi.filter(
  (f) => !existsSync(f.replace(/\.(jpe?g|png)$/i, '.webp'))
);

console.log(`Toplam gorsel      : ${hepsi.length}`);
console.log(`Webp'si olan       : ${hepsi.length - eksik.length}`);
console.log(`Uretilecek (eksik) : ${eksik.length}\n`);

let oncesi = 0, sonrasi = 0, n = 0;
for (const f of eksik) {
  const hedef = f.replace(/\.(jpe?g|png)$/i, '.webp');
  const b = statSync(f).size;
  try {
    await sharp(f)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: KALITE })
      .toFile(hedef);
    const a = statSync(hedef).size;
    oncesi += b; sonrasi += a; n++;
    const rel = f.slice(IMG_DIR.length + 1);
    console.log(
      `  ${rel}: ${(b / 1024).toFixed(0)}K -> ${(a / 1024).toFixed(0)}K` +
      `  (%${(100 - (a / b) * 100).toFixed(0)} kucuk)`
    );
  } catch (e) {
    console.log(`  [HATA] ${f.slice(IMG_DIR.length + 1)}: ${String(e).slice(0, 60)}`);
  }
}

console.log(`\nUretilen: ${n} webp`);
if (n) {
  console.log(
    `Boyut   : ${(oncesi / 1048576).toFixed(1)} MB -> ` +
    `${(sonrasi / 1048576).toFixed(1)} MB ` +
    `(%${(100 - (sonrasi / oncesi) * 100).toFixed(0)} tasarruf)`
  );
}
