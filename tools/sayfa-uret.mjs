/**
 * YENI KONU SAYFASI URETICI  (9 Agu 2026)
 *
 * NEDEN: Kullanicinin is onceligi sirasi — 1) tadilat 2) izolasyon/mantolama
 * 3) celik ev 4) kat karsiligi 5) kaba insaat. Ama sitede TADILAT sadece
 * 4 kez, IZOLASYON/MANTOLAMA/RENOVASYON HIC gecmiyor. Yani en cok para
 * kazandiran iki is sitede satilmiyor.
 *
 * O kelimelere sayfa olmadan reklam vermek zarar: ziyaretci arad ıgını
 * bulamaz + Google "acilis sayfasi alakasiz" deyip Kalite Puanini dusurur
 * -> ayni tiklama daha pahaliya gelir. Once sayfa, sonra reklam.
 *
 * YONTEM: havuz-yapim-maliyeti.html iskeletini sablon alir (head + nav +
 * teklif formu + footer + scriptler birebir korunur), sadece govdeyi
 * degistirir. Boylece Google etiketi, donusum kodu, i18n, form ve menu
 * yeni sayfada da AYNEN calisir.
 *
 * KULLANIM:  node tools/sayfa-uret.mjs <sayfa-anahtari> [--uygula]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SABLON = join(ROOT, 'havuz-yapim-maliyeti.html');
const UYGULA = process.argv.includes('--uygula');
const ANAHTAR = process.argv[2];

// ─────────────────────────────────────────────────────────── icerik
const SAYFALAR = {
  tadilat: {
    dosya: 'tadilat-fiyatlari.html',
    title: 'Tadilat Fiyatları 2026 — Ev, Daire ve Ofis Tadilat Maliyeti | Aşkın Yapı',
    desc: 'Ev, daire ve ofis tadilatında 2026 kapsam, süreç ve maliyet rehberi. Komple tadilat, mutfak-banyo yenileme, boya ve zemin işleri. Ücretsiz keşif ve teklif.',
    konu: 'tadilat',
    h1: 'Tadilat Fiyatları 2026 — Kapsam, Süreç ve Maliyet',
    lead: 'Tadilat, inşaatın en çok yanlış anlaşılan kalemidir. Aynı daire için iki firmadan iki kat fark teklif gelebilir — çünkü kimse aynı işi kastetmemektedir. Bu sayfa, bir tadilat teklifinin neyi kapsaması gerektiğini, hangi kalemlerin fiyatı belirlediğini ve süreci adım adım anlatır.',
    govde: `
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">TADİLAT TİPLERİ</span>
      <h2>Dört tadilat kapsamı ve birbirinden farkı</h2>
      <p>Teklif alırken ilk netleştirilmesi gereken şey kapsamdır. Aşağıdaki dört başlık, sahada en sık karşılaştığımız taleplerdir.</p>
    </div>
    <div class="grid-2">
      <div class="card reveal">
        <h3>Komple Tadilat</h3>
        <p>Daire ya da müstakil yapının tümüyle yenilenmesi. Mevcut kaplamaların sökümü, tesisat ve elektriğin yenilenmesi, ıslak hacimlerin komple değişimi, zemin, boya ve doğrama işleri.</p>
        <p><strong>Süre:</strong> 100 m² daire için tipik olarak 6–10 hafta.<br><strong>Kritik nokta:</strong> Tesisat ve elektrik yenilenmiyorsa bu komple tadilat değildir; birkaç yıl sonra aynı duvarı ikinci kez açarsınız.</p>
      </div>
      <div class="card reveal">
        <h3>Mutfak ve Banyo Yenileme</h3>
        <p>Tadilatın en yoğun ve en teknik bölümü. Su tesisatı, gider eğimi, su yalıtımı, seramik ve mobilya işleri bir arada yürür.</p>
        <p><strong>Süre:</strong> Banyo 2–3 hafta, mutfak 3–4 hafta.<br><strong>Kritik nokta:</strong> Su yalıtımı yapılmadan seramik döşenen banyo, alt komşuya sızıntı olarak geri döner. Yalıtım kalemi teklifte açıkça yazmıyorsa sorun.</p>
      </div>
      <div class="card reveal">
        <h3>Boya, Zemin ve Yüzey İşleri</h3>
        <p>Yapısal müdahale olmadan görünümün yenilenmesi: alçı tamiri, saten ve boya, laminat veya parke, süpürgelik, kapı-pencere bakımı.</p>
        <p><strong>Süre:</strong> 100 m² için 1–2 hafta.<br><strong>Kritik nokta:</strong> Zemin altındaki şap düzgün değilse laminat kısa sürede oynar. Şap kontrolü olmadan verilen zemin fiyatı eksik fiyattır.</p>
      </div>
      <div class="card reveal">
        <h3>Ofis ve Dükkân Tadilatı</h3>
        <p>Ticari mekânlarda bölme, aydınlatma, zemin, cephe ve vitrin işleri. Konuttan farkı: süre baskısı ve mesai dışı çalışma gerekliliği.</p>
        <p><strong>Süre:</strong> Kapsama göre 3–8 hafta.<br><strong>Kritik nokta:</strong> İşletme açıkken tadilat yapılacaksa bu baştan planlanmalı; sonradan istenen vardiya düzeni maliyeti değiştirir.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">FİYATI BELİRLEYEN KALEMLER</span>
      <h2>İki teklif arasındaki farkın gerçek sebebi</h2>
      <p>Aynı daire için gelen iki teklif arasında iki kat fark varsa, sebebi genellikle fiyat değil kapsamdır. Farkın nereden çıktığını gösteren altı kalem:</p>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>Söküm ve moloz</strong><span>Mevcut kaplamaların sökülmesi, molozun bina dışına taşınması ve nakliyesi. Apartmanda asansör kullanılamıyorsa bu kalem ciddi şekilde artar. Tekliflerde en sık atlanan kalemdir.</span></div>
      <div class="kv"><strong>Tesisat ve elektrik</strong><span>Su borularının ve elektrik hattının yenilenip yenilenmediği. Yenilenmiyorsa fiyat düşer ama iş yarım kalır — duvarı ikinci kez açmak, ilk seferde yapmaktan pahalıdır.</span></div>
      <div class="kv"><strong>Su yalıtımı</strong><span>Banyo, mutfak ve balkonda zemin ve duvar yalıtımı. Görünmediği için ilk kesilen kalem; sızıntı olarak geri döndüğünde maliyeti tadilatın tamamını aşabilir.</span></div>
      <div class="kv"><strong>Malzeme sınıfı</strong><span>Seramik, armatür, mutfak dolabı ve doğramada sınıf farkı toplam maliyeti belirgin şekilde değiştirir. Teklifte marka ve model yazmıyorsa fiyat karşılaştırması anlamsızdır.</span></div>
      <div class="kv"><strong>Yapının yaşı ve durumu</strong><span>Eski yapılarda söküm sırasında beklenmedik durumlar çıkar: çürümüş tesisat, düzgün olmayan şap, taşıyıcıya dokunmuş önceki müdahaleler. Keşif bu riski baştan görmek içindir.</span></div>
      <div class="kv"><strong>Kat ve erişim</strong><span>Yüksek kat, dar merdiven, asansörsüz bina ya da araç yanaşamayan sokak; malzeme ve moloz taşımayı doğrudan etkiler. Aynı iş farklı binada farklı maliyettir.</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">SÜREÇ</span>
      <h2>Keşiften teslime altı adım</h2>
      <p>Tadilatta en çok sorun, sıranın bozulmasından çıkar. Doğru sıra şudur:</p>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>1 · Keşif</strong><span>Yerinde ölçüm, mevcut tesisat ve zemin durumunun tespiti, yapının yaşına göre risklerin belirlenmesi. Ücretsizdir ve teklifin doğruluğu buna bağlıdır.</span></div>
      <div class="kv"><strong>2 · Kapsam ve teklif</strong><span>Yapılacak işlerin kalem kalem yazıldığı, malzeme sınıfının belirtildiği teklif. "Komple tadilat" tek satır değil, kalem listesidir.</span></div>
      <div class="kv"><strong>3 · Söküm</strong><span>Kaplamaların sökülmesi, molozun tahliyesi. Bu aşamada ortaya çıkan sürprizler varsa kapsam burada revize edilir — sonradan değil.</span></div>
      <div class="kv"><strong>4 · Alt yapı</strong><span>Tesisat, elektrik, su yalıtımı ve şap. Görünmeyen ama işin ömrünü belirleyen kısım. Aceleye gelmemesi gereken tek aşama budur.</span></div>
      <div class="kv"><strong>5 · Kaplama ve uygulama</strong><span>Seramik, zemin, alçı, boya, dolap ve doğrama. Görünen iş burada başlar ve hızlı ilerler.</span></div>
      <div class="kv"><strong>6 · Temizlik ve teslim</strong><span>İnce temizlik, eksik ve kusur listesinin birlikte gezilerek çıkarılması, giderilmesi ve teslim.</span></div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">DİKKAT</span>
      <h2>Tadilatta en sık yapılan beş hata</h2>
    </div>
    <div class="kv-list reveal">
      <div class="kv"><strong>Kapsamı yazılı hale getirmemek</strong><span>Sözlü anlaşılan iş, sonunda "bu dahil değildi" tartışmasına döner. Kalem listesi olmayan teklif teklif değildir.</span></div>
      <div class="kv"><strong>En ucuz teklifi seçmek</strong><span>En ucuz teklif çoğu zaman en dar kapsamlı tekliftir. Karşılaştırma yaparken fiyata değil, kalem sayısına ve malzeme sınıfına bakın.</span></div>
      <div class="kv"><strong>Su yalıtımından kısmak</strong><span>Görünmediği için kesilir, sızıntı çıkınca yeni yapılan banyo yeniden sökülür. Tadilatta en pahalı tasarruf kalemidir.</span></div>
      <div class="kv"><strong>Malzemeyi son anda seçmek</strong><span>Seramik ya da dolap seçimi gecikirse iş durur. Malzeme kararları söküm aşamasında verilmiş olmalıdır.</span></div>
      <div class="kv"><strong>Apartman iznini atlamak</strong><span>Gürültülü işler için yönetim izni ve komşu bilgilendirmesi baştan yapılmazsa iş ortasında durabilir.</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">SIKÇA SORULANLAR</span>
      <h2>Tadilat hakkında SSS</h2>
    </div>
    <div class="reveal">
      <div class="faq-item">
        <p class="faq-q">Tadilat ne kadar sürer?</p>
        <div class="faq-a">Kapsama göre değişir. <strong>Boya ve zemin</strong> ağırlıklı bir yenileme 100 m² için 1–2 hafta; <strong>mutfak ve banyo</strong> yenilemesi 3–4 hafta; <strong>komple tadilat</strong> 6–10 haftadır. Eski yapılarda söküm sırasında çıkan sürprizler süreyi uzatabilir — bu yüzden keşifte yapının yaşı ve mevcut tesisat durumu ayrıca değerlendirilir.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Tadilat sırasında evde oturulabilir mi?</p>
        <div class="faq-a">Boya ve zemin gibi tek bölümde ilerleyen işlerde çoğu zaman oturulabilir. Ancak <strong>komple tadilatta, tesisat yenilemesinde ve ıslak hacim işlerinde</strong> su ve elektrik kesintileri olacağı için tavsiye edilmez. Kısmi ilerleme mümkünse iş bölge bölge planlanabilir; bu baştan konuşulmalıdır.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Teklifte nelere bakmalıyım?</p>
        <div class="faq-a">Şu altı kalemin teklifte <strong>ayrı ayrı</strong> yazılı olması gerekir: söküm ve moloz nakliyesi, tesisat yenilemesi, elektrik yenilemesi, su yalıtımı, malzeme sınıfı (marka/model), temizlik ve teslim. Bunlar yazılı değilse iki teklifi karşılaştırmanız mümkün değildir — farklı işlerin fiyatını kıyaslamış olursunuz.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Kombi, tesisat ve elektrik de yenilenmeli mi?</p>
        <div class="faq-a">Yapı 20 yaşın üzerindeyse ve tesisat hiç yenilenmediyse <strong>evet</strong>. Duvarlar zaten açılacağı için ek maliyet, sonradan yapılacak müdahaleye göre çok daha düşüktür. Tadilat sonrası ortaya çıkan bir su kaçağı, yeni yapılmış zemini ve seramiği sökmek anlamına gelir.</div>
      </div>
      <div class="faq-item">
        <p class="faq-q">Ücretsiz keşif neyi kapsıyor?</p>
        <div class="faq-a">Yerinde ölçüm, mevcut tesisat ve zemin durumunun tespiti, yapının yaşına bağlı risklerin belirlenmesi ve kapsam önerisi. Keşif sonunda <strong>kalem kalem yazılı teklif</strong> iletilir. Keşif ve teklif için herhangi bir ücret alınmaz, bağlayıcılığı da yoktur.</div>
      </div>
    </div>
  </div>
</section>
`,
  },
};

// ─────────────────────────────────────────────────────────── uret
if (!ANAHTAR || !SAYFALAR[ANAHTAR]) {
  console.log('Kullanim: node tools/sayfa-uret.mjs <' + Object.keys(SAYFALAR).join('|') + '> [--uygula]');
  process.exit(1);
}
const S = SAYFALAR[ANAHTAR];
const sablon = readFileSync(SABLON, 'utf8');

// govde sinirlari: </header> ... <section class="section hizli-teklif"
const bas = sablon.indexOf('</header>') + '</header>'.length;
const son = sablon.indexOf('<section class="section hizli-teklif"');
if (bas < 20 || son < 0) { console.log('HATA: sablon sinirlari bulunamadi'); process.exit(1); }

const ustKisim = sablon.slice(0, bas);
const altKisim = sablon.slice(son);

// hero + govde
const hero = `
<section class="price-hero">
  <div class="container">
    <span class="eyebrow">AŞKIN YAPI · TADİLAT</span>
    <h1>${S.h1}</h1>
    <p class="lead">${S.lead}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="#teklif">Ücretsiz Keşif İsteyin</a>
      <a class="btn btn-secondary" href="tel:+905320606612">+90 532 060 66 12</a>
    </div>
  </div>
</section>
${S.govde}`;

// ust kisimdaki meta/baslik/canonical degistir
let ust = ustKisim
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${S.title}</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${S.desc}">`)
  .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://xn--akninaatmimarlk-8kcm72ffa.com/${S.dosya}">`)
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${S.title}">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${S.desc}">`)
  .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://xn--akninaatmimarlk-8kcm72ffa.com/${S.dosya}">`)
  .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${S.title}">`)
  .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${S.desc}">`);

// formdaki proje tipini bu sayfaya ayarla (varsayilan secili)
let alt = altKisim.replace(/(<option value="diger")/, '$1 selected');
alt = alt.replace(/ selected(?=[^>]*value="havuz")/g, '');
alt = alt.replace(/(<option value="havuz")( selected)?/, '$1');

const html = ust + hero + '\n' + alt;
const hedef = join(ROOT, S.dosya);

console.log('='.repeat(64));
console.log(`  SAYFA URETIMI: ${S.dosya}   ${UYGULA ? 'YAZILIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(64));
console.log(`  baslik   : ${S.title}`);
console.log(`  kelime   : ~${html.replace(/<[^>]*>/g, ' ').split(/\s+/).length}`);
console.log(`  bolum    : ${(html.match(/<section/g) || []).length}`);
console.log(`  SSS      : ${(html.match(/faq-item/g) || []).length}`);
console.log(`  form     : ${(html.match(/id="hizliTeklif"/g) || []).length}`);
console.log(`  Ads etiketi: ${(html.match(/AW-10888629695/g) || []).length}`);
console.log(`  zaten var mi: ${existsSync(hedef) ? 'EVET (uzerine yazilacak)' : 'hayir'}`);

if (UYGULA) {
  writeFileSync(hedef, html, 'utf8');
  console.log(`\n  YAZILDI -> ${S.dosya}`);
} else {
  console.log('\n  --uygula ile yaz.');
}
