# Aşkın İnşaat Mimarlık — İş Kazanma & Büyüme Planı

> Amaç: Web sitesini "broşür" olmaktan çıkarıp **teklif/iş getiren bir makineye** dönüştürmek.
> Bu doküman; sitede yapılan teknik iyileştirmeleri **gerçek işe** çevirmek için atılması gereken
> adımları içerir. Kod kısmı tamamlandı; aşağıdakiler işletme sahibinin yapması gerekenlerdir.

---

## 0. Önce gerçekçi matematik (5M TL nasıl çıkar?)

İş, web sitesinden "sihirle" gelmez; bir **huni** ile gelir:

```
Hedeflenmiş ziyaretçi → Lead (teklif talebi/WhatsApp) → Görüşme → İmzalı iş
     ~1.000/ay              ~%3 = 30 lead          ~%30 = 9      ~%25 = 2-3 iş
```

- Bir **çelik villa / hafif çelik ev** işi ≈ 1–3 milyon TL.
- Bir **kat karşılığı** anlaşması veya **havuz + sosyal tesis** paketi çok daha büyük.
- Yani 2 ayda **2–3 doğru iş** = 5M TL hedefi ulaşılabilir.

Anahtar: Ayda ~1.000 **doğru** ziyaretçi (çelik ev/müteahhit arayan), hızlı lead takibi.

---

## 1. HEMEN (bu hafta) — ücretsiz, en yüksek etki

### 1.1 Google İşletme Profili (Google Business Profile) — EN ÖNEMLİSİ
"izmir müteahhit", "çelik ev izmir", "dikili inşaat" aramalarında **haritada** çıkmanın tek yolu.
- https://business.google.com → işletme oluştur
- Kategori: **İnşaat şirketi / Müteahhit / Mimarlık ofisi**
- Adres (Dikili ofisi), telefon **+90 532 060 66 12**, web sitesi, çalışma saatleri
- En az **15–20 proje fotoğrafı** yükle (çelik villa, havuz, şantiye, bitmiş işler)
- İlk **5 müşteri yorumu**nu topla (memnun müşterilerden iste — yorum = sıralama + güven)

### 1.2 Google Search Console
- https://search.google.com/search-console → siteyi doğrula
- **sitemap.xml**'i gönder: `https://xn--akninaatmimarlk-8kcm72ffa.com/sitemap.xml` (artık hazır)
- Böylece Google tüm sayfaları hızlıca indeksler

### 1.3 Formspree (iletişim formunu canlı yap)
Form şu an `mailto`'ya düşüyor → mobilde lead kaybı. Düzeltmek için:
1. https://formspree.io → ücretsiz hesap aç
2. Yeni form oluştur → bir **form ID** verir (örn. `xeqwabcd`)
3. `iletisim.html` içinde `YOUR_FORM_ID` yazan yeri bu ID ile değiştir
4. Artık her form gönderimi doğrudan **info@askininsaatmimarlik.com**'a düşer (lead kaybı sıfır)

### 1.4 Görselleri optimize et (hız = sıralama + dönüşüm)
Site şu an 191MB görsel taşıyor, mobilde çok yavaş. Düzeltmek için:
```bash
cd askin-insaat
npm init -y
npm install sharp
node tools/optimize-images.mjs
```
Sonuç: ~191MB → ~6MB. Mobil yükleme 5sn → <1sn. (Orijinaller yedeklenir.)

---

## 2. İLK 2 HAFTA — hızlı lead akışı (ücretli ama en hızlı)

### 2.1 Google Ads (Arama Ağı) — en hızlı iş kaynağı
SEO 2–3 ayda oturur; Ads **yarın** lead getirir. Yüksek niyetli kelimelere odaklan:

| Hedef kelime grubu | Niyet |
|---|---|
| çelik ev fiyatları, hafif çelik villa fiyat | Satın almaya yakın |
| çelik villa modelleri, prefabrik çelik ev | Araştırıyor |
| kat karşılığı müteahhit izmir / ankara | Yüksek değerli |
| dikili / izmir müteahhit, villa yapımı | Yerel |
| havuz yapımı / havuz inşaatı izmir | Niş, kârlı |

- Başlangıç bütçesi: **günlük 200–400 TL** (~ay 6.000–12.000 TL), tek bir işle fazlasıyla geri döner
- Reklamı **iletisim.html** veya özel "teklif al" sayfasına yönlendir
- Dönüşüm takibi kur (form gönderimi + WhatsApp tıklaması)

### 2.2 WhatsApp Business
- Numarayı **WhatsApp Business**'a taşı (katalog, hızlı yanıtlar, çalışma saati)
- Katalog'a çelik ev modellerini fiyat aralığıyla ekle
- **Kural: her lead'e 5 dakika içinde dön.** Hız, işi kazanmanın en büyük belirleyicisi.

---

## 3. İLK 1–2 AY — kalıcı organik trafik (SEO içerik)

Google'da sürekli bulunmak için **niyet odaklı sayfalar** ekle (her biri yeni lead kapısı):

1. **"Çelik Ev Fiyatları 2026 — m² Maliyeti ve Modeller"** (en çok aranan)
2. **"Kat Karşılığı İnşaat Nedir? Sözleşme ve Süreç Rehberi"** (yüksek değerli lead)
3. **"Hafif Çelik vs. Betonarme: Hangisi?"** (karşılaştırma = güven)
4. **"Havuz Yapım Maliyeti ve Süreci"** (100+ havuz deneyiminizi vurgular)
5. **Proje vaka çalışmaları**: her bitmiş iş için öncesi/sonrası + süre + müşteri yorumu

> İpucu: Sitede zaten `fiyat-hesaplama.html` ve `havuz-hesaplayici.html` benzeri araçlar var
> (Desktop'ta). Bunları siteye **interaktif hesaplayıcı** olarak koymak güçlü lead mıknatısıdır
> ("E-posta gir, detaylı teklif al").

---

## 4. GÜVEN SİNYALLERİ (dönüşümü 2-3x artırır)

- **Müşteri yorumları/videoları** — ana sayfaya ekle
- **Rakamlar**: "2011'den beri", "100+ havuz", "1.35M m² Beypazarı" — zaten var, öne çıkar
- **Sertifika/üyelikler**: müteahhitlik yetki belgesi, ticaret odası, varsa ISO
- **Ekip sayfası**: gerçek yüzler güven verir (şu an yok)
- **Garanti/teslim süresi taahhüdü** — net yaz

---

## 5. TAKİP & ÖLÇÜM

- **Google Analytics 4** kur → hangi kanal lead getiriyor gör
- Her ay: ziyaretçi, lead sayısı, görüşme, imzalanan iş → huniyi takip et
- Reklam harcamasını işe dönüşen kelimelere kaydır

---

## Öncelik sırası (özet checklist)

- [ ] Google İşletme Profili + 20 foto + 5 yorum
- [ ] Search Console + sitemap.xml gönder
- [ ] Formspree ID'sini siteye gir
- [ ] `node tools/optimize-images.mjs` çalıştır
- [ ] WhatsApp Business + 5 dakika yanıt kuralı
- [ ] Google Ads kampanyası (günlük 200–400 TL)
- [ ] 3-5 SEO içerik sayfası ekle
- [ ] Müşteri yorumlarını siteye koy
- [ ] GA4 ile ölç, aylık gözden geçir

---
*Bu plan, web sitesindeki teknik altyapı (SEO, lead yakalama, hız) tamamlandıktan sonra
işletmenin uygulaması gereken pazarlama adımlarını içerir. Site artık iş almaya hazır;
bu adımlar trafiği ve dönüşümü getirir.*
