/**
 * TADILAT SAYFASINA "ONCE 3D GORURSUNUZ" BOLUMU  (9 Agu 2026)
 *
 * NEDEN: Kullanici mimar ve tadilattan ONCE plan + 3D gorsellestirme yapip
 * sunuyor. Bu, tadilat pazarinda ciddi bir ayrisma: musteri sonucu
 * goremedigi icin karar vermekte zorlanir, en buyuk tereddut budur.
 * Sayfada bundan hic bahsedilmiyordu.
 *
 * Gorseller kullanicinin kendi arsivinden (Desktop\PORTFOLIO):
 *   07_Interior_Kabakum\Interior_01_living_hero.jpg  -> salon
 *   07_Interior_Kabakum\Interior_04_kitchen.jpg      -> mutfak
 *   09_cafe_bistro\Levent_Cafe_01_salon.jpg          -> ticari mekan
 *
 * Kaynaklar 3840x2160 / 4-6 MB. Web icin 1180 ve 760 px webp uretilir
 * (sitedeki hero ile ayni yontem), <picture srcset> ile sunulur.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, statSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'assets', 'images');
const PORT = 'C:\\Users\\pc\\Desktop\\PORTFOLIO';
const UYGULA = process.argv.includes('--uygula');

const ISLER = [
  { kaynak: join(PORT, '07_Interior_Kabakum', 'Interior_01_living_hero.jpg'),
    ad: 'tadilat-3d-salon',
    alt: 'Tadilat öncesi hazırlanan salon görselleştirmesi' },
  { kaynak: join(PORT, '07_Interior_Kabakum', 'Interior_04_kitchen.jpg'),
    ad: 'tadilat-3d-mutfak',
    alt: 'Tadilat öncesi hazırlanan mutfak görselleştirmesi' },
  { kaynak: join(PORT, '09_cafe_bistro', 'Levent_Cafe_01_salon.jpg'),
    ad: 'tadilat-3d-ticari',
    alt: 'Ticari mekân tadilatı öncesi hazırlanan görselleştirme' },
];

const kb = p => (statSync(p).size / 1024).toFixed(0);

console.log('='.repeat(66));
console.log(`  TADILAT 3D BOLUMU   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(66));

for (const i of ISLER) {
  if (!existsSync(i.kaynak)) { console.log(`  [YOK] ${i.kaynak}`); continue; }
  console.log(`  kaynak: ${i.ad}  ${kb(i.kaynak)} KB`);
  for (const w of [760, 1180]) {
    const hedef = join(IMG, `${i.ad}-${w}.webp`);
    if (existsSync(hedef)) { console.log(`    [VAR] ${i.ad}-${w}.webp  ${kb(hedef)} KB`); continue; }
    if (!UYGULA) { console.log(`    [YENI] ${i.ad}-${w}.webp`); continue; }
    await sharp(i.kaynak).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 }).toFile(hedef);
    console.log(`    [OK]  ${i.ad}-${w}.webp  ${kb(hedef)} KB`);
  }
  // webp desteklemeyen tarayici icin kucuk jpg yedegi
  const jpg = join(IMG, `${i.ad}.jpg`);
  if (!existsSync(jpg) && UYGULA) {
    await sharp(i.kaynak).resize({ width: 1180, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true }).toFile(jpg);
    console.log(`    [OK]  ${i.ad}.jpg  ${kb(jpg)} KB  (yedek)`);
  }
}

const gorsel = i => `
        <figure class="uc-gorsel reveal">
          <picture>
            <source type="image/webp"
                    srcset="assets/images/${i.ad}-760.webp 760w,
                            assets/images/${i.ad}-1180.webp 1180w"
                    sizes="(max-width:960px) 92vw, 33vw">
            <img src="assets/images/${i.ad}.jpg" alt="${i.alt}" loading="lazy" decoding="async">
          </picture>
        </figure>`;

const BOLUM = `
<!-- 9 Agu 2026: Kullanici mimar; tadilattan ONCE plan + 3D sunuyor.
     Tadilat pazarinda en buyuk tereddut "sonucu goremiyorum" — bu bolum
     tam olarak onu kaldiriyor. Gorseller kullanicinin kendi projeleri. -->
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">MİMARİ YAKLAŞIM</span>
      <h2>Tadilata başlamadan önce sonucu görürsünüz</h2>
      <p>Tadilatta en büyük tereddüt, sonucun nasıl görüneceğini kestirememektir. Biz mimarlık kökenli çalışıyoruz: işe başlamadan önce mekânın planını çıkarır, üç boyutlu görselleştirmesini hazırlar ve size sunarız. Malzeme, renk ve yerleşim kararlarını <strong>duvar yıkılmadan önce</strong> birlikte veririz.</p>
    </div>
    <div class="uc-gorsel-grid">${ISLER.map(gorsel).join('')}
    </div>
    <div class="kv-list reveal" style="margin-top:28px;">
      <div class="kv"><strong>Plan ve ölçüm</strong><span>Mevcut mekânın rölövesi çıkarılır; taşıyıcı duvarlar, tesisat hatları ve pencere konumları belirlenir. Neyin değişebileceği, neyin sabit kalması gerektiği baştan netleşir.</span></div>
      <div class="kv"><strong>Üç boyutlu görselleştirme</strong><span>Seçilen malzeme, renk ve mobilya ile mekânın gerçekçi görselleri hazırlanır. Seramik ya da dolap rengini fotoğraftan değil, kendi mekânınızda görerek seçersiniz.</span></div>
      <div class="kv"><strong>Sunum ve revizyon</strong><span>Görseller üzerinden birlikte gözden geçirilir. Değişiklik ekranda yapılır — sahada değil. Bir kararı görselde değiştirmek bedava, uygulamada değiştirmek pahalıdır.</span></div>
      <div class="kv"><strong>Uygulama</strong><span>Onaylanan tasarım kalem kalem tekliflendirilir ve sahada birebir uygulanır. Teslimde çıkan sonuç, başta onayladığınız görselin aynısıdır.</span></div>
    </div>
  </div>
</section>
`;

const CSS = `
/* 9 Agu 2026 — tadilat sayfasi 3D gorsel seridi */
.uc-gorsel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.uc-gorsel{margin:0;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);aspect-ratio:16/10;background:var(--bg-alt)}
.uc-gorsel img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.22,.61,.36,1)}
.uc-gorsel:hover img{transform:scale(1.05)}
@media(max-width:960px){.uc-gorsel-grid{grid-template-columns:1fr;gap:14px}}
`;

if (UYGULA) {
  // 1) bolumu ekle — "Dört tadilat kapsamı" bolumunden ONCE
  const p = join(ROOT, 'tadilat-fiyatlari.html');
  let h = readFileSync(p, 'utf8');
  if (h.includes('uc-gorsel-grid')) {
    console.log('\n  bolum ZATEN EKLI');
  } else {
    const isaret = '<span class="eyebrow">TADİLAT TİPLERİ</span>';
    const bas = h.lastIndexOf('<section', h.indexOf(isaret));
    if (bas < 0) { console.log('\n  [HATA] yerlestirme noktasi bulunamadi'); }
    else {
      if (!existsSync(p + '.bak-3d')) copyFileSync(p, p + '.bak-3d');
      h = h.slice(0, bas) + BOLUM + '\n' + h.slice(bas);
      writeFileSync(p, h, 'utf8');
      console.log('\n  bolum eklendi (TADILAT TIPLERI bolumunden once)');
    }
  }
  // 2) CSS
  const pc = join(ROOT, 'assets', 'css', 'styles.css');
  const c = readFileSync(pc, 'utf8');
  if (!c.includes('.uc-gorsel-grid')) {
    writeFileSync(pc, c + CSS, 'utf8');
    console.log('  CSS eklendi (.uc-gorsel-grid)');
  }
} else {
  console.log('\n  --uygula ile calistir.');
}
