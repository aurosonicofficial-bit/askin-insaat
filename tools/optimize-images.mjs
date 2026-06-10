/**
 * Görsel optimizasyon scripti — 191MB → ~5-8MB hedefler.
 * Büyük JPG/PNG'leri en fazla 1920px genişliğe küçültür, sıkıştırır ve
 * yanına .webp üretir. Orijinaller assets/images-original/ klasörüne yedeklenir.
 *
 * KURULUM (tek seferlik):
 *   cd askin-insaat
 *   npm init -y
 *   npm install sharp
 *
 * ÇALIŞTIRMA:
 *   node tools/optimize-images.mjs
 *
 * Neden önemli: Mobilde 6MB'lık görsel = 5+ saniye yükleme = kaçan müşteri.
 * Google da yavaş siteyi alt sıraya atar. Bu script hız puanını ciddi yükseltir.
 */
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR = join(ROOT, 'assets', 'images');
const BACKUP = join(ROOT, 'assets', 'images-original');
const MAX_W = 1920;
const MAX_BYTES = 400 * 1024; // bu boyutun altındakilere dokunma

function walk(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(IMG_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
let saved = 0, before = 0, after = 0;

for (const file of files) {
  const sizeBefore = statSync(file).size;
  if (sizeBefore < MAX_BYTES) continue;
  before += sizeBefore;

  // yedek
  const rel = file.slice(IMG_DIR.length + 1);
  const bakPath = join(BACKUP, rel);
  if (!existsSync(bakPath)) {
    mkdirSync(dirname(bakPath), { recursive: true });
    copyFileSync(file, bakPath);
  }

  const isPng = extname(file).toLowerCase() === '.png';
  const img = sharp(bakPath).resize({ width: MAX_W, withoutEnlargement: true });
  const buf = isPng
    ? await img.png({ quality: 82, compressionLevel: 9 }).toBuffer()
    : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();

  const { writeFileSync } = await import('node:fs');
  writeFileSync(file, buf);
  // yan webp
  await sharp(bakPath).resize({ width: MAX_W, withoutEnlargement: true })
    .webp({ quality: 78 }).toFile(file.replace(/\.(jpe?g|png)$/i, '.webp'));

  const sizeAfter = statSync(file).size;
  after += sizeAfter;
  saved++;
  console.log(`${rel}: ${(sizeBefore/1024/1024).toFixed(1)}MB → ${(sizeAfter/1024).toFixed(0)}KB`);
}

console.log(`\nOptimize edilen: ${saved} görsel`);
console.log(`Toplam: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB`);
console.log(`Yedek: assets/images-original/  (sorun olursa geri alınabilir)`);

// WebP manifestini güncelle (main.js bunu okuyup <img>'leri webp'ye çevirir)
await import('./gen-webp-manifest.mjs');
