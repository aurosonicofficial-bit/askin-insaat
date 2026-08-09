/**
 * MANTOLAMA VE CEPHE SAYFASI  (9 Agu 2026)
 *
 * Kullanicinin is onceligi sirasinda 2. sirada; sitede "izolasyon",
 * "mantolama", "renovasyon" kelimeleri HIC gecmiyordu.
 *
 * Kullanicinin tarifi: "binaya gore projeye gore sen hepsini ekle,
 * mantolama ve cephe tasarim uygulamalari olmali." Yani sistem secimi
 * bina bazli yapiliyor ve is sadece yalitim degil, CEPHE TASARIMI da
 * iceriyor — bu tadilattaki gibi mimarlik tarafi, ayrisma noktasi.
 *
 * Gorseller kullanicinin kendi projeleri (Desktop\PORTFOLIO):
 *   03_Apartment_Salimbey  -> apartman cephesi (mantolamanin asil pazari)
 *   01_Villa_Fethiye       -> villa cephesi
 *   08_Commercial_Manisa   -> ticari cephe
 *
 * Sablon: havuz-yapim-maliyeti.html iskeleti (head/nav/form/footer birebir).
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'assets', 'images');
const PORT = 'C:\\Users\\pc\\Desktop\\PORTFOLIO';
const UYGULA = process.argv.includes('--uygula');
const DOSYA = 'mantolama-cephe-yalitimi.html';

const GORSELLER = [
  { kaynak: join(PORT, '03_Apartment_Salimbey', 'Apartment_Salimbey_01.jpg'),
    ad: 'cephe-3d-apartman', alt: 'Apartman cephe tasarımı ve mantolama görselleştirmesi' },
  { kaynak: join(PORT, '01_Villa_Fethiye', 'Villa_Fethiye_01_hero.jpg'),
    ad: 'cephe-3d-villa', alt: 'Villa cephe tasarımı görselleştirmesi' },
  { kaynak: join(PORT, '08_Commercial_Manisa', 'Nuvesta_01.jpg'),
    ad: 'cephe-3d-ticari', alt: 'Ticari yapı cephe tasarımı görselleştirmesi' },
];

const kb = p => (statSync(p).size / 1024).toFixed(0);

console.log('='.repeat(66));
console.log(`  MANTOLAMA / CEPHE SAYFASI   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(66));

for (const g of GORSELLER) {
  if (!existsSync(g.kaynak)) { console.log(`  [YOK] ${g.ad}`); continue; }
  console.log(`  ${g.ad}  kaynak ${kb(g.kaynak)} KB`);
  for (const w of [760, 1180]) {
    const hedef = join(IMG, `${g.ad}-${w}.webp`);
    if (existsSync(hedef)) { console.log(`    [VAR] ${w}w  ${kb(hedef)} KB`); continue; }
    if (!UYGULA) { console.log(`    [YENI] ${w}w`); continue; }
    await sharp(g.kaynak).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 }).toFile(hedef);
    console.log(`    [OK] ${w}w  ${kb(hedef)} KB`);
  }
  const jpg = join(IMG, `${g.ad}.jpg`);
  if (!existsSync(jpg) && UYGULA) {
    await sharp(g.kaynak).resize({ width: 1180, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true }).toFile(jpg);
    console.log(`    [OK] yedek jpg  ${kb(jpg)} KB`);
  }
}

const figur = g => `
        <figure class="uc-gorsel reveal">
          <picture>
            <source type="image/webp"
                    srcset="assets/images/${g.ad}-760.webp 760w,
                            assets/images/${g.ad}-1180.webp 1180w"
                    sizes="(max-width:960px) 92vw, 33vw">
            <img src="assets/images/${g.ad}.jpg" alt="${g.alt}" loading="lazy" decoding="async">
          </picture>
        </figure>`;

const BASLIK = 'Mantolama ve Cephe Yalıtımı 2026 — Sistem Seçimi, Cephe Tasarımı ve Uygulama | Aşkın Yapı';
const ACIKLAMA = 'Mantolama, çatı ve su yalıtımı ile cephe tasarımı ve uygulaması. EPS, taş yünü ve XPS sistemlerinin bina bazlı seçimi. Mimari görselleştirme, ücretsiz keşif ve teklif.';

const GOVDE = `
<section class="price-hero">
  <div class="container">
    <span class="eyebrow">AŞKIN YAPI · YALITIM VE CEPHE</span>
    <h1>Mantolama ve Cephe Yalıtımı — Sistem Seçimi ve Cephe Tasarımı</h1>
    <p class="lead">Mantolama tek başına bir kaplama işi değildir; binanın yüksekliği, mevcut cephe durumu ve kullanım amacına göre <strong>sistem seçilir</strong>. Biz işin iki tarafını birlikte yürütüyoruz: yalıtımın teknik kısmını ve cephenin nasıl görüneceğini. <strong>Mimarlık kökenli çalıştığımız için</strong> cephe tasarımını da biz yapar, uygulamadan önce üç boyutlu olarak sunarız.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#teklif">Ücretsiz Keşif İsteyin</a>
      <a class="btn btn-secondary" href="tel:+905320606612">+90 532 060 66 12</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">MİMARİ YAKLAŞIM</span>
      <h2>Cephenin nasıl görüneceğini önceden görürsünüz</h2>
      <p>Mantolama kararı çoğu zaman "ısı kaçağı" diye başlar, ama bina bir daha on beş yıl o cepheyle yaşar. Renk, doku ve kaplama kararlarını uygulamadan sonra değiştirmek mümkün değildir. Bu yüzden cephe tasarımını önce çizer, görselleştirir ve sunarız.</p>
    </div>
    <div class="uc-gorsel-grid">${GORSELLER.map(figur).join('')}
    </div>
    <div class="kv-list reveal" style="margin-top:28px;">
      <div class="kv"><strong>Mevcut durum tespiti</strong><span>Cephenin ölçüsü, mevcut sıva ve boyanın durumu, nem ve çatlak tespiti. Yalıtım, bozuk bir zemine yapıştırılırsa birkaç yıl içinde şişer ve ayrılır — tespit bu yüzden ilk adımdır.</span></div>
      <div class="kv"><strong>Cephe tasarımı</strong><span>Renk, doku, kaplama bölgeleri ve detaylar çizilir. Aynı bina, aynı yalıtım kalınlığıyla bambaşka görünebilir; fark tasarımdadır.</span></div>
      <div class="kv"><strong>Üç boyutlu sunum</strong><span>Tasarım gerçekçi görsellerle sunulur. Apartmanlarda bu, kat malikleri toplantısında karar almayı ciddi şekilde kolaylaştırır — herkes aynı şeyi görür.</span></div>
      <div class="kv"><strong>Uygulama</strong><span>Onaylanan tasarım, seçilen yalıtım sistemiyle sahada uygulanır. Teslimde çıkan sonuç, onayladığınız görselin aynısıdır.</span></div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">SİSTEM SEÇİMİ</span>
      <h2>Hangi binada hangi yalıtım sistemi</h2>
      <p>Tek doğru malzeme yoktur; doğru olan binaya uyandır. Sistem, yapının yüksekliğine, cephe durumuna ve bütçeye göre seçilir.</p>
    </div>
    <div class="grid-2">
      <div class="card reveal">
        <h3>EPS — Genleştirilmiş Polistiren</h3>
        <p>Konutlarda en yaygın kullanılan sistem. Hafiftir, uygulaması hızlıdır ve maliyet avantajı sağlar. Karbon katkılı (grafitli) türü aynı kalınlıkta daha yüksek yalıtım değeri verir.</p>
        <p><strong>Uygun olduğu yer:</strong> Az ve orta katlı konut binaları, müstakil evler, villa cepheleri.</p>
      </div>
      <div class="card reveal">
        <h3>Taş Yünü — Mineral Yün</h3>
        <p>Yanmaz sınıfta bir malzemedir; yangın güvenliği öne çıktığında ve yönetmelik gereği yüksek yapı sınıfına giren binalarda kullanılır. Ayrıca ses yalıtımı EPS'e göre belirgin şekilde iyidir.</p>
        <p><strong>Uygun olduğu yer:</strong> Yüksek katlı binalar, cadde üzerindeki gürültülü konumlar, yangın gerekliliği olan yapılar.</p>
      </div>
      <div class="card reveal">
        <h3>XPS — Ekstrüde Polistiren</h3>
        <p>Suya ve basınca dayanıklıdır. Cephenin tamamında değil, suyla temas eden ve yük alan bölgelerde kullanılır.</p>
        <p><strong>Uygun olduğu yer:</strong> Bina eteği (subasman), bodrum duvarları, teras ve balkon zeminleri.</p>
      </div>
      <div class="card reveal">
        <h3>Kalınlık kararı</h3>
        <p>Kalınlık marka değil hesap işidir: bölgenin iklim kuşağı, duvar yapısı ve hedeflenen tasarruf birlikte değerlendirilir. Gereğinden ince yalıtım parayı boşa harcar, gereğinden kalın olan da kendini amorti etmez.</p>
        <p><strong>Karar:</strong> Keşifte binanın duvar kesiti ve konumu görülerek belirlenir.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">KAPSAM</span>
      <h2>Yalıtım sadece dış cephe değildir</h2>
      <p>Isı kaybının tamamı duvardan olmaz. Cepheyi yalıtıp çatıyı ya da terası atlamak, sonucu ciddi şekilde düşürür.</p>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>Dış cephe (mantolama)</strong><span>Isı kaybının en büyük kalemi ve cephenin görünümünü belirleyen katman. Yalıtım levhası, donatı sıvası, file ve dekoratif son kat birlikte bir sistem oluşturur; biri eksik olursa sistem çalışmaz.</span></div>
      <div class="kv"><strong>Çatı yalıtımı</strong><span>Isı yukarı çıkar; yalıtımsız çatı, mantolamanın etkisini gözle görülür şekilde azaltır. Çatı tipine göre şap altı, ahşap arası ya da üstten uygulama yapılır.</span></div>
      <div class="kv"><strong>Teras ve balkon su yalıtımı</strong><span>Su kaçağı en pahalı hasardır ve genellikle alt kata verilen zararla fark edilir. Membran ya da sürme yalıtım, üzerine gelen kaplamayla birlikte planlanır.</span></div>
      <div class="kv"><strong>Islak hacim su yalıtımı</strong><span>Banyo ve mutfak zemin ve duvarlarında, seramik altına uygulanan katman. Tadilat sırasında yapılmazsa sonradan yapmak seramiği sökmek demektir.</span></div>
      <div class="kv"><strong>Ses yalıtımı</strong><span>Cadde üzerindeki binalarda ve komşu duvarlarında ayrıca değerlendirilir. Taş yünü bu konuda EPS'ten belirgin şekilde üstündür.</span></div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">FİYATI BELİRLEYEN KALEMLER</span>
      <h2>İki mantolama teklifi neden farklı çıkar</h2>
      <p>Mantolamada m² fiyatı en çok yanıltan rakamdır; aynı sayı, çok farklı işleri anlatabilir. Farkı yaratan kalemler:</p>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>Yalıtım cinsi ve kalınlığı</strong><span>EPS, grafitli EPS, taş yünü ve XPS arasında ciddi fiyat farkı vardır. Kalınlık arttıkça malzeme maliyeti de artar. Teklifte cins ve kalınlık yazmıyorsa o teklif karşılaştırılamaz.</span></div>
      <div class="kv"><strong>Sistem bütünlüğü</strong><span>Yapıştırıcı, dübel, donatı filesi, köşe profilleri, denizlik ve damlalıklar sistemin parçasıdır. Ucuz tekliflerde en sık atlanan kalemler bunlardır ve eksikleri birkaç yıl içinde çatlak olarak görünür.</span></div>
      <div class="kv"><strong>Son kat kaplama</strong><span>Düz boya ile dekoratif sıva, taş görünümlü panel ya da ahşap doku arasında hem malzeme hem işçilik farkı vardır. Cephenin görünümünü belirleyen kalem budur.</span></div>
      <div class="kv"><strong>İskele ve yükseklik</strong><span>Bina yüksekliği iskele maliyetini ve iş süresini doğrudan etkiler. Dar sokak ya da iskele kurulamayan cephelerde farklı yöntem gerekir; bu baştan görülmelidir.</span></div>
      <div class="kv"><strong>Mevcut cephenin durumu</strong><span>Kabaran boya, bozuk sıva, çatlak ya da nem varsa önce onarım gerekir. Bu hazırlık yapılmadan yapılan yalıtım, zeminiyle birlikte ayrılır.</span></div>
      <div class="kv"><strong>Detaylar</strong><span>Pencere kenarları, balkon altları, çatı birleşimleri ve zemin etek bölgesi. Isı köprüsü buralarda oluşur; düzgün çözülmezse yalıtımın verimi düşer.</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">SÜREÇ</span>
      <h2>Keşiften teslime</h2>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>1 · Keşif ve tespit</strong><span>Cephe ölçüsü, mevcut yüzeyin durumu, nem ve çatlak tespiti, bina yüksekliği ve iskele koşulları. Ücretsizdir.</span></div>
      <div class="kv"><strong>2 · Sistem ve kalınlık kararı</strong><span>Binaya uygun yalıtım cinsi ve kalınlığı belirlenir; yangın ve ses gereklilikleri varsa burada değerlendirilir.</span></div>
      <div class="kv"><strong>3 · Cephe tasarımı ve sunum</strong><span>Renk, doku ve kaplama bölgeleri çizilir, üç boyutlu görselleştirilir ve sunulur. Apartmanlarda karar bu aşamada kolaylaşır.</span></div>
      <div class="kv"><strong>4 · Yüzey hazırlığı</strong><span>Bozuk sıva ve kabaran boya alınır, çatlaklar onarılır, yüzey yalıtım alacak hale getirilir. Atlanırsa tüm iş risk altındadır.</span></div>
      <div class="kv"><strong>5 · Uygulama</strong><span>Levha yapıştırma ve dübelleme, donatı sıvası ve file, köşe profilleri, astar ve son kat kaplama sırasıyla uygulanır.</span></div>
      <div class="kv"><strong>6 · Kontrol ve teslim</strong><span>Detaylar, denizlikler ve birleşim noktaları birlikte gezilerek kontrol edilir, eksikler giderilir ve teslim yapılır.</span></div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">DİKKAT</span>
      <h2>Mantolamada en sık yapılan beş hata</h2>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>Yüzey hazırlığını atlamak</strong><span>Kabaran boyanın üzerine yapıştırılan levha, boyayla birlikte cepheden ayrılır. En pahalı hata budur; iş baştan yapılır.</span></div>
      <div class="kv"><strong>Dübel kullanmamak</strong><span>Sadece yapıştırıcıyla tutturulan levhalar zamanla ve rüzgâr yüküyle gevşer. Dübel sayısı ve deseni sistemin parçasıdır.</span></div>
      <div class="kv"><strong>Detayları çözmeden başlamak</strong><span>Pencere kenarı, denizlik ve balkon altı çözülmezse su yalıtımın arkasına girer. Isı köprüsü ve nem sorunu buradan çıkar.</span></div>
      <div class="kv"><strong>Sadece cepheyi yalıtmak</strong><span>Çatı ve teras atlanırsa beklenen tasarruf oluşmaz ve "mantolama işe yaramadı" sonucuna varılır. Oysa sistem eksik uygulanmıştır.</span></div>
      <div class="kv"><strong>Rengi cephede seçmek</strong><span>Küçük renk kartelasında beğenilen ton, yüzlerce m² cephede çok farklı görünür. Görselleştirme tam olarak bunun içindir.</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">SIKÇA SORULANLAR</span>
      <h2>Mantolama ve cephe hakkında SSS</h2>
    </div>
    <div class="reveal">
      <div class="faq-item">
        <p class="faq-q">Mantolama ne kadar sürede kendini amorti eder?</p>
        <div class="faq-a">Isıtma giderindeki azalma; binanın mevcut durumuna, yakıt tipine ve iklim bölgesine göre değişir. Amortisman süresi bu üç değişkenin bileşimidir — tek bir rakam vermek doğru olmaz. Keşifte binanın duvar yapısı ve konumu görülerek <strong>gerçekçi bir beklenti</strong> paylaşılır. Yalıtımın tek faydası yakıt tasarrufu da değildir: yoğuşma ve küf sorunu ortadan kalkar, iç mekân konforu belirgin şekilde artar.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">EPS mi taş yünü mü kullanmalıyım?</p>
        <div class="faq-a">Binaya göre değişir. <strong>EPS</strong>, az ve orta katlı konutlarda maliyet ve uygulama hızı bakımından öne çıkar. <strong>Taş yünü</strong>, yangın güvenliğinin gerekli olduğu yüksek yapılarda ve gürültülü konumlarda tercih edilir; ses yalıtımı belirgin şekilde daha iyidir. <strong>XPS</strong> ise cephenin tamamında değil, bina eteği ve teras gibi su ile temas eden bölgelerde kullanılır. Doğru seçim keşifte binanın yüksekliği ve konumu görülerek yapılır.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Apartmanda mantolama kararı nasıl alınır?</p>
        <div class="faq-a">Kat malikleri kararı gerekir. Uygulamada en çok zorlanılan nokta, herkesin sonucu farklı hayal etmesidir. Bu yüzden karar toplantısından önce <strong>cephe tasarımını görselleştirip sunmak</strong> süreci ciddi şekilde kolaylaştırır — renk ve kaplama tartışması somut bir görsel üzerinden yapılır, herkes aynı şeyi görür. Talep edilirse toplantı için sunum hazırlanır.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Kışın mantolama yapılabilir mi?</p>
        <div class="faq-a">Yapıştırıcı, sıva ve son kat kaplamanın priz alması için belirli bir sıcaklık ve kuruluk gerekir. Çok soğuk, yağışlı ya da donlu havada uygulama <strong>yapılmamalıdır</strong>; yapılırsa sistem beklenen dayanımı göstermez. Uygun mevsim genellikle ilkbahar ve sonbahardır. Kış aylarında keşif, tasarım ve teklif süreci yürütülür, uygulama havaya göre planlanır.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Cephe tasarımı ayrı bir ücret mi?</p>
        <div class="faq-a">Uygulamayı biz yapıyorsak cephe tasarımı ve görselleştirme <strong>işin parçasıdır</strong>, ayrıca ücretlendirilmez. Mimarlık kökenli çalıştığımız için bu bizim için ek bir hizmet değil, işin doğal ilk adımıdır. Keşif ve teklif de ücretsizdir ve bağlayıcılığı yoktur.</div>
      </div>
    </div>
  </div>
</section>
`;

if (!UYGULA) { console.log('\n  --uygula ile calistir.'); process.exit(0); }

// sablondan iskelet
const sablon = readFileSync(join(ROOT, 'havuz-yapim-maliyeti.html'), 'utf8');
const bas = sablon.indexOf('</header>') + '</header>'.length;
const son = sablon.indexOf('<section class="section hizli-teklif"');
let ust = sablon.slice(0, bas);
let alt = sablon.slice(son);

ust = ust
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${BASLIK}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${ACIKLAMA}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://xn--akninaatmimarlk-8kcm72ffa.com/${DOSYA}">`)
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${BASLIK}">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${ACIKLAMA}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://xn--akninaatmimarlk-8kcm72ffa.com/${DOSYA}">`)
  .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${BASLIK}">`)
  .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${ACIKLAMA}">`);

// formda izolasyon acik gelsin
alt = alt.replace(/ selected/g, '').replace('<option value="izolasyon"', '<option value="izolasyon" selected');

const html = ust + GOVDE + '\n' + alt;
writeFileSync(join(ROOT, DOSYA), html, 'utf8');

console.log(`\n  YAZILDI -> ${DOSYA}`);
console.log(`  kelime : ~${html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length}`);
console.log(`  bolum  : ${(html.match(/<section/g) || []).length}`);
console.log(`  SSS    : ${(html.match(/faq-item/g) || []).length}`);
console.log(`  form   : ${(html.match(/id="hizliTeklif"/g) || []).length}`);
console.log(`  Ads    : ${(html.match(/AW-10888629695/g) || []).length}`);
