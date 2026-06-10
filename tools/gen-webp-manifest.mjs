/**
 * WebP manifest üretici.
 * assets/images altındaki tüm .webp dosyalarını tarar ve göreli yollarını
 * assets/images/webp-manifest.json içine yazar.
 *
 * main.js bu manifesti okuyup, bir görselin .webp sürümü varsa <img> src'sini
 * otomatik webp'ye çevirir (404 üretmeden, hata olursa orijinale döner).
 *
 * ÇALIŞTIRMA: node tools/gen-webp-manifest.mjs
 * (optimize-images.mjs sonunda otomatik de çağrılır.)
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'assets', 'images');

function walk(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

const webps = walk(IMG_DIR)
  .filter((f) => /\.webp$/i.test(f))
  .map((f) => 'assets/images/' + f.slice(IMG_DIR.length + 1).split('\\').join('/'));

writeFileSync(join(IMG_DIR, 'webp-manifest.json'), JSON.stringify(webps));
console.log(`webp-manifest.json yazıldı: ${webps.length} kayıt`);
