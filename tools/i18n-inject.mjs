/**
 * Sayfa gövdesine data-i18n enjekte eder.
 * Her giriş: [key, tag, text] → <tag ...>text</tag> öğesinin açılış etiketine
 * data-i18n="key" eklenir. Metin, HTML'de zaten var olan TR içerikle birebir eşleşmeli.
 * Idempotent: data-i18n="key" zaten varsa atlar.
 *
 * Çeviri karşılıkları assets/js/i18n.js içindeki EXTRA sözlüğündedir.
 * ÇALIŞTIRMA: node tools/i18n-inject.mjs [dosya.html]   (arg yoksa tümü)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const MAPS = {
  'kurumsal.html': [
    ['kur_eyebrow', 'span', 'Kurumsal'],
    ['kur_h1', 'h1', 'Kurumsal yaklaşımımız; tasarım, uygulama ve teslim disiplinini aynı çerçevede yönetmeye dayanır.'],
    ['kur_lead', 'p', 'Aşkın İnşaat Mimarlık Yapı, 2011\'den bu yana konut, ticari yapı, çelik sistem ve büyük ölçekli proje geliştirme alanlarında hizmet veren kurumsal bir yapı firmasıdır.'],
    ['kur_profile_h', 'h2', 'Şirket Profili'],
    ['kur_profile_p1', 'p', 'Aşkın İnşaat Mimarlık Yapı; proje sürecini yalnızca mimari üretim olarak değil, planlama, uygulama, saha koordinasyonu ve teslim yönetiminin bütünü olarak ele alır. Bu anlayış, her projeye özgü çözümler geliştirme kapasitemizin temelini oluşturur.'],
    ['kur_profile_p2', 'p', 'Türkiye\'de İzmir / Dikili merkezli saha varlığımızı, Birleşik Krallık merkezli kurumsal temsil yapımızla destekliyor; ulusal ve uluslararası projelerde tek yetkili muhatap olarak hizmet veriyoruz.'],
    ['kur_profile_p3', 'p', 'Referans arşivimizde 2011–2025 dönemine yayılan konut projeleri, geniş ölçekli yerleşim alanları, AVM ve sosyal tesisler, çelik sistem yapılar ve 100\'ün üzerinde havuz uygulaması yer almaktadır.'],
    ['kur_mv_h', 'h3', 'Misyon ve Vizyon'],
    ['kur_mission_label', 'strong', 'Misyon'],
    ['kur_mission_p', 'p', 'Her ölçekteki yapı projesini, kalite standardını ve teslimat disiplinini ödünsüz koruyarak hayata geçirmek.'],
    ['kur_vision_label', 'strong', 'Vizyon'],
    ['kur_vision_p', 'p', 'Türkiye ve Birleşik Krallık arasında köprü kuran, uluslararası standartlarda proje geliştiren lider bir yapı firması olmak.'],
    ['kur_offices_h', 'h3', 'Ofisler'],
    ['kur_label_uk', 'strong', 'Birleşik Krallık'],
    ['kur_label_tr', 'strong', 'Türkiye'],
    ['kur_label_phone', 'strong', 'Telefon'],
    ['kur_label_email', 'strong', 'E-posta'],
    ['kur_refarchive_h', 'h3', 'Referans Arşivi'],
    ['kur_refarchive_p', 'p', '2011–2025 dönemine ait tüm referans projelerimizi içeren kurumsal sunum dosyasını inceleyin.'],
    ['kur_pdf_btn', 'a', 'PDF Referans Dosyası'],
    ['kur_expertise_eyebrow', 'span', 'Uzmanlık Alanları'],
    ['kur_expertise_h2', 'h2', 'Tek çatı altında yönetilen dört ana hizmet başlığı.'],
    ['kur_card1_num', 'div', 'İnşaat'],
    ['kur_card1_h', 'h3', 'Uygulama ve Taahhüt'],
    ['kur_card1_p', 'p', 'Saha kurulumu, şantiye yönetimi ve kontrollü yapım süreçleri. Temel kazısından geçici kabulüne tek muhatap.'],
    ['kur_card2_num', 'div', 'Mimarlık'],
    ['kur_card2_h', 'h3', 'Tasarım ve Proje Dili'],
    ['kur_card2_p', 'p', 'Konsept geliştirme, uygulama projesi, cephe tasarımı ve teknik detay yönetimi. İç mekândan kentsel ölçeğe.'],
    ['kur_card3_num', 'div', 'Çelik Sistem'],
    ['kur_card3_h', 'h3', 'Hafif Çelik Çözümleri'],
    ['kur_card3_p', 'p', 'Villa, tek katlı yaşam yapısı ve özel planlı hafif çelik sistem uygulamaları. Hızlı kurulum ve uzun ömür.'],
    ['kur_stats_eyebrow', 'span', 'Sayılarla Aşkın Yapı'],
    ['kur_stats_h2', 'h2', '14 yıllık birikim, belgelenmiş referanslar.'],
    ['kur_metric1', 'span', 'Kuruluş yılı ve ilk referans projesi'],
    ['kur_metric2', 'span', 'Havuz ve sosyal tesis projesi'],
    ['kur_metric3', 'span', 'Beypazarı yerleşim projesi alanı'],
    ['kur_metric4', 'span', 'İki ülkede kurumsal temsil'],
  ],
  'faaliyet-alanlari.html': [
    ['fa_eyebrow', 'span', 'Faaliyet Alanları'],
    ['fa_h1', 'h1', 'İnşaat, mimarlık, çelik sistem ve proje geliştirme başlıklarını birbirini tamamlayan alanlar olarak ele alıyoruz.'],
    ['fa_lead', 'p', '2011\'den bu yana edinilen saha deneyimi ve kurumsal birikim, her projeyi tasarımdan teslime tek elden yönetme kapasitesi sunmaktadır.'],
    ['fa_c1_h', 'h3', 'İnşaat ve Kat Karşılığı'],
    ['fa_c1_p', 'p', 'Şantiye koordinasyonu, saha yönetimi ve uygulama takibi. Proje başlangıcından geçici kabulüne dek tüm süreçlerde tek yetkili muhatap.'],
    ['fa_c2_h', 'h3', 'Mimarlık ve Tasarım'],
    ['fa_c2_p', 'p', 'Konut, ticari yapı ve sosyal alanlara yönelik konsept ve uygulama projesi. Cephe dili, iç mekân kurgusu ve teknik detay bütünlüğü.'],
    ['fa_c3_h', 'h3', 'Çelik Sistem Yapılar'],
    ['fa_c3_p', 'p', 'Hafif çelik taşıyıcılı villa ve tek katlı yapı sistemleri. Kontrollü üretim, hızlı montaj ve uzun ömürlü yapısal çözümler.'],
    ['fa_c4_h', 'h3', 'Havuz ve Sosyal Tesisler'],
    ['fa_c4_p', 'p', 'Referans arşivinde 100\'ün üzerinde havuz projesi. Yüzme havuzu, jakuzi, spor tesisi ve peyzaj entegrasyonu kapsamında hizmet.'],
    ['fa_examples_eyebrow', 'span', 'Proje Örnekleri'],
    ['fa_examples_h2', 'h2', 'Faaliyet alanlarını yansıtan referans projelerden seçkiler.'],
    ['fa_p1_h', 'h3', 'Çelik Sistem Villa'],
    ['fa_p1_p', 'p', 'Hızlı kurulum ve kontrollü detay yönetimi ile tamamlanan hafif çelik taşıyıcı villa uygulaması.'],
    ['fa_p2_h', 'h3', 'Tek Katlı Çelik Yapı'],
    ['fa_p2_p', 'p', 'Fonksiyonel, ekonomik ve hızlı teslim odaklı tek katlı çelik sistem yapı çözümleri.'],
    ['fa_p3_h', 'h3', 'Manora Prestij'],
    ['fa_p3_p', 'p', 'Konut bloğu için geliştirilen cephe dili, kat planı kurgusu ve sunum görselleri.'],
    ['fa_scale_eyebrow', 'span', 'Büyük Ölçek Deneyimi'],
    ['fa_scale_h3', 'h3', '1.350.000 m² proje alanı, 1200 daire ve 50.000 m² ticari hacim.'],
    ['fa_scale_p', 'p', 'Beypazarı / Ankara büyük ölçekli yerleşim projesi, karma kullanım planlama ve saha koordinasyonu konusundaki kurumsal kapasitemizi ortaya koymaktadır.'],
    ['fa_btn_view', 'a', 'Projeyi İncele'],
  ],
  'projeler.html': [
    ['prj_eyebrow', 'span', 'Projeler'],
    ['prj_h1', 'h1', 'Görselleştirme, uygulama ve saha fotoğraflarıyla desteklenen proje seçkisi.'],
    ['prj1_t', 'h3', 'Manora Prestij'],
    ['prj1_d', 'p', 'Konut bloğu için geliştirilen mimari görselleştirme ve cephe dili.'],
    ['prj_cat_residential', 'span', 'Konut'],
    ['prj2_t', 'h3', 'Çelik Villa Dikili'],
    ['prj2_d', 'p', 'İki katlı çelik sistem villa uygulaması.'],
    ['prj_cat_steel', 'span', 'Çelik Sistem'],
    ['prj3_t', 'h3', 'Tek Katlı Çelik Yaşam Yapısı'],
    ['prj3_d', 'p', 'Doğaya uyumlu tek katlı yaşam yapısı için hafif çelik kurulum örneği.'],
    ['prj_cat_single', 'span', 'Tek Katlı Çelik'],
    ['prj4_t', 'h3', 'Çayyolu Ankara'],
    ['prj4_d', 'p', 'Konut ve açık alan kurgusu içeren proje görseli.'],
    ['prj_cat_mixed', 'span', 'Karma Kullanım'],
    ['prj5_t', 'h3', 'Beypazarı Ankara Yerleşim Projesi'],
    ['prj5_d', 'p', '1.350.000 m² alan üzerine kurulan büyük ölçekli proje arşivi.'],
    ['prj_cat_settlement', 'span', 'Yerleşim'],
    ['prj6_t', 'h3', 'Çelik Yapılar Portföyü'],
    ['prj6_d', 'p', 'Referans dokümanındaki uygulama, taşıyıcı sistem ve teslim örnekleri.'],
    ['prj_cat_archive', 'span', 'Kurumsal Arşiv'],
    ['btn_view_project', 'a', 'Projeyi İncele →'],
    ['prj_photo_archive', 'a', 'Fotoğraf Arşivi →'],
  ],
  'iletisim.html': [
    ['ile_eyebrow', 'span', 'İletişim'],
    ['ile_h1', 'h1', 'Proje, teklif ve kurumsal görüşmeler için bizimle iletişime geçin.'],
    ['ile_lead', 'p', 'Aşkın İnşaat Mimarlık Yapı ekibi olarak her projeye özel yaklaşım sergiliyoruz. Mesajınızı bırakın, en kısa sürede dönelim.'],
    ['ile_form_h', 'h2', 'Mesaj Gönderin'],
    ['ile_lbl_name', 'label', 'Ad Soyad *'],
    ['ile_lbl_phone', 'label', 'Telefon'],
    ['ile_lbl_email', 'label', 'E-posta Adresi *'],
    ['ile_lbl_subject', 'label', 'Konu'],
    ['ile_lbl_message', 'label', 'Mesajınız *'],
    ['ile_opt_select', 'option', 'Konu seçin'],
    ['ile_opt_quote', 'option', 'Proje Teklifi'],
    ['ile_opt_steel', 'option', 'Çelik Sistem Yapı'],
    ['ile_opt_residential', 'option', 'Konut Projesi'],
    ['ile_opt_arch', 'option', 'Mimari Tasarım'],
    ['ile_opt_pool', 'option', 'Havuz ve Sosyal Tesis'],
    ['ile_opt_other', 'option', 'Diğer'],
    ['ile_btn_send', 'button', 'Mesajı Gönder →'],
    ['ile_divider', 'div', 'veya anında ulaşın'],
    ['ile_info_h', 'h3', 'İletişim Bilgileri'],
    ['ile_lbl_company', 'strong', 'Şirket'],
    ['ile_s_phone', 'strong', 'Telefon'],
    ['ile_s_email', 'strong', 'E-posta'],
    ['ile_s_uk', 'strong', 'Birleşik Krallık Ofisi'],
    ['ile_s_tr', 'strong', 'Türkiye Ofisi'],
    ['ile_quote_h', 'h3', 'Teklif Talebi'],
    ['ile_quote_p', 'p', 'Projenizin detaylarını paylaşın; fizibilite değerlendirmesi ve teklifimizi hazırlayalım.'],
    ['ile_ref_btn', 'a', 'Referans Dosyasını İncele'],
  ],
};

// Attribute (placeholder vb.) çevirileri: [key, attrName, currentValue]
const ATTR_MAPS = {
  'iletisim.html': [
    ['ile_ph_name', 'placeholder', 'Ahmet Yılmaz'],
    ['ile_ph_phone', 'placeholder', '+90 5xx xxx xx xx'],
    ['ile_ph_email', 'placeholder', 'ornek@sirket.com'],
    ['ile_ph_message', 'placeholder', 'Projeniz hakkında kısa bilgi verin…'],
  ],
};

const only = process.argv[2];
const files = only ? [only] : [...new Set([...Object.keys(MAPS), ...Object.keys(ATTR_MAPS)])];

for (const file of files) {
  const path = join(ROOT, file);
  let html = readFileSync(path, 'utf8');
  let n = 0, miss = 0;
  for (const [key, tag, text] of (MAPS[file] || [])) {
    if (html.includes(`data-i18n="${key}"`)) { n++; continue; } // zaten var (idempotent)
    const re = new RegExp(`(<${tag}\\b(?:[^>]*?))(>)${esc(text)}(</${tag}>)`, 'g');
    const before = html;
    html = html.replace(re, `$1 data-i18n="${key}"$2${text}$3`); // tüm eşleşmeler
    if (html === before) { console.log(`  ⚠ bulunamadı: ${key} (${tag}) "${text.slice(0, 40)}…"`); miss++; continue; }
    n++;
  }
  // attribute (placeholder vb.) çevirileri
  for (const [key, attr, val] of (ATTR_MAPS[file] || [])) {
    if (html.includes(`data-i18n-attr="${attr}:${key}"`)) { n++; continue; }
    const needle = `${attr}="${val}"`;
    if (!html.includes(needle)) { console.log(`  ⚠ attr bulunamadı: ${key} (${attr}) "${val.slice(0, 30)}…"`); miss++; continue; }
    html = html.replace(needle, `${needle} data-i18n-attr="${attr}:${key}"`);
    n++;
  }
  writeFileSync(path, html, 'utf8');
  console.log(`✓ ${file}: ${n} işaretli${miss ? `, ${miss} eksik` : ''}`);
}
