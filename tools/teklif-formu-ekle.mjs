/**
 * TEKLIF FORMUNU REKLAM SAYFALARINA EKLER  (9 Agu 2026)
 *
 * DURUM: 5 konu sayfasi (celik ev fiyatlari, kat karsiligi, havuz maliyeti,
 * celik ev modelleri, hafif celik vs betonarme) 1500-2000 kelimelik dolu
 * icerik sayfalari ve arama niyetine iyi cevap veriyorlar — ama HICBIRINDE
 * form yok. Ikna olan ziyaretci teklif icin iletisim.html'e tiklamak
 * zorunda; her ek adim ziyaretcinin kabaca yarisini goturuyor.
 *
 * YAPILAN: anasayfadaki hizli teklif formunun aynisi, footer'dan hemen
 * once. Fark: her sayfada <select> o sayfanin konusuyla ACIK GELIYOR —
 * "celik ev fiyatlari"ni okuyan biri formda zaten "Celik Sistem Yapi"
 * secili buluyor.
 *
 * Formspree adresi ve donusum kimlikleri anasayfayla AYNI, boylece Ads
 * tarafinda tek bir "Form Gonderimi" hedefi olarak birikir.
 *
 * KURU CALISTIRMA varsayilan:  node tools/teklif-formu-ekle.mjs
 * UYGULAMA:                    node tools/teklif-formu-ekle.mjs --uygula
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UYGULA = process.argv.includes('--uygula');

// sayfa -> formda hangi proje tipi acik gelsin
const SAYFALAR = {
  'celik-ev-fiyatlari.html':       'celik',
  'celik-ev-modelleri.html':       'celik',
  'hafif-celik-vs-betonarme.html': 'celik',
  'kat-karsiligi-insaat.html':     'kat-karsiligi',
  'havuz-yapim-maliyeti.html':     'havuz',
};

const secenek = (deger, secili, i18n, metin) =>
  `<option value="${deger}"${deger === secili ? ' selected' : ''} data-i18n="${i18n}">${metin}</option>`;

const bolum = (secili) => `
<!-- 9 Agu 2026: hizli teklif formu. Bu sayfa reklamin indigi sayfalardan
     biri; ikna olan ziyaretciyi baska sayfaya tiklatmamak icin form burada.
     <select> bu sayfanin konusuyla acik geliyor. -->
<section class="section hizli-teklif" id="teklif">
  <div class="container">
    <div class="teklif-kutu">
      <div class="teklif-metin">
        <span class="eyebrow" data-i18n="qf_eyebrow">ÜCRETSİZ KEŞİF VE TEKLİF</span>
        <h2 data-i18n="qf_h2">Projenizi anlatın, size dönelim.</h2>
        <p data-i18n="qf_desc">Çelik ev, kat karşılığı, havuz ya da mimari proje — adınızı ve telefonunuzu bırakın, size uygun çözümü konuşalım.</p>
        <div class="teklif-guven">
          <span data-i18n="qf_trust_1">2011'den beri saha deneyimi</span>
          <span data-i18n="qf_trust_2">100+ havuz projesi</span>
          <span data-i18n="qf_trust_3">Türkiye ve Birleşik Krallık</span>
        </div>
      </div>
      <form class="contact-form teklif-form" id="hizliTeklif"
            action="https://formspree.io/f/xpqejzyp" method="POST"
            onsubmit="hizliGonder(event)">
        <div class="form-row">
          <div class="form-group">
            <label for="h_ad" data-i18n="qf_lbl_name">Ad Soyad *</label>
            <input type="text" id="h_ad" name="ad" required placeholder="Ahmet Yılmaz" data-i18n-attr="placeholder:qf_ph_name">
          </div>
          <div class="form-group">
            <label for="h_tel" data-i18n="qf_lbl_phone">Telefon *</label>
            <input type="tel" id="h_tel" name="telefon" required placeholder="+90 5xx xxx xx xx" data-i18n-attr="placeholder:qf_ph_phone">
          </div>
        </div>
        <div class="form-group">
          <label for="h_konu" data-i18n="qf_lbl_type">Proje tipi</label>
          <select id="h_konu" name="konu">
            ${secenek('celik', secili, 'ile_opt_steel', 'Çelik Sistem Yapı')}
            ${secenek('kat-karsiligi', secili, 'qf_opt_kk', 'Kat Karşılığı İnşaat')}
            ${secenek('konut', secili, 'ile_opt_residential', 'Konut Projesi')}
            ${secenek('havuz', secili, 'ile_opt_pool', 'Havuz ve Sosyal Tesis')}
            ${secenek('mimari', secili, 'ile_opt_arch', 'Mimari Tasarım')}
            ${secenek('diger', secili, 'ile_opt_other', 'Diğer')}
          </select>
        </div>
        <button type="submit" class="btn btn-primary" data-i18n="qf_btn_send">Teklif İste →</button>
        <button type="button" class="btn btn-whatsapp" onclick="hizliWhatsApp()">
          <svg viewBox="0 0 32 32" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.7L.5 31.5l8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.8 1.3 1.3-4.6-.3-.5c-1.3-2.1-2-4.5-2-7 0-7.2 5.9-13 13-13s13 5.8 13 13-5.8 13.9-13 13.9z"/></svg>
          <span data-i18n="qf_btn_wa">WhatsApp'tan yazın</span>
        </button>
        <div class="form-success" id="hizliSuccess" data-i18n="qf_success">✓ Talebiniz alındı. En kısa sürede sizi arayacağız.</div>
      </form>
    </div>
  </div>
</section>
`;

const JS = `
<script>
// 9 Agu 2026 — hizli teklif formu (anasayfadakiyle ayni mantik).
// Donusum SADECE gonderim gercekten basarili olunca tetiklenir.
function hizliWhatsApp(){
  var ad  = (document.getElementById('h_ad')||{}).value || '';
  var tel = (document.getElementById('h_tel')||{}).value || '';
  var k   = (document.getElementById('h_konu')||{}).value || '';
  var m = 'Merhaba, teklif almak istiyorum.' +
          (ad  ? '\\nAd: ' + ad : '') +
          (tel ? '\\nTelefon: ' + tel : '') +
          (k   ? '\\nProje: ' + k : '');
  if (typeof gtag === 'function') {
    gtag('event','conversion',{send_to:'AW-10888629695/YpRPCJCTh9IcEL-bjcgo'});
  }
  window.open('https://wa.me/905320606612?text=' + encodeURIComponent(m), '_blank');
}
async function hizliGonder(e){
  e.preventDefault();
  var form = document.getElementById('hizliTeklif');
  var btn  = form.querySelector('button[type=submit]');
  var ok   = document.getElementById('hizliSuccess');
  var eski = btn.textContent;
  btn.textContent = 'Gönderiliyor…'; btn.disabled = true;
  var bitir = function(){
    ok.style.display = 'block';
    btn.textContent = eski; btn.disabled = false;
    form.reset();
    if (typeof gtag === 'function') {
      gtag('event','conversion',{send_to:'AW-10888629695/WXq1CJOTh9IcEL-bjcgo'});
    }
  };
  try {
    var res = await fetch(form.getAttribute('action'), {
      method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}
    });
    if (res.ok) { bitir(); return; }
  } catch(_) {}
  btn.textContent = eski; btn.disabled = false;
  hizliWhatsApp();   // aglar koptuysa lead kaybolmasin
}
</script>
`;

console.log('='.repeat(64));
console.log(`  TEKLIF FORMU -> REKLAM SAYFALARI   ${UYGULA ? 'UYGULANIYOR' : 'KURU CALISTIRMA'}`);
console.log('='.repeat(64));

let n = 0;
for (const [dosya, secili] of Object.entries(SAYFALAR)) {
  const yol = join(ROOT, dosya);
  if (!existsSync(yol)) { console.log(`  [YOK]   ${dosya}`); continue; }
  let h = readFileSync(yol, 'utf8');

  if (h.includes('id="hizliTeklif"')) { console.log(`  [ZATEN] ${dosya}`); continue; }
  if (!h.includes('<footer class="footer">')) { console.log(`  [HATA]  ${dosya} — footer bulunamadi`); continue; }
  if (!h.includes('</body>')) { console.log(`  [HATA]  ${dosya} — </body> yok`); continue; }

  h = h.replace('<footer class="footer">', bolum(secili) + '\n<footer class="footer">');
  h = h.replace('</body>', JS + '\n</body>');

  if (UYGULA) {
    if (!existsSync(yol + '.bak-form')) copyFileSync(yol, yol + '.bak-form');
    writeFileSync(yol, h, 'utf8');
  }
  console.log(`  [OK]    ${dosya.padEnd(32)} varsayilan: ${secili}`);
  n++;
}
console.log(`\n  ${n} sayfa${UYGULA ? ' guncellendi' : ' guncellenecek'}`);
if (!UYGULA) console.log('  --uygula ile calistir.');
