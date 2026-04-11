# Aşkın İnşaat Mimarlık Yapı — Kurumsal Web Sitesi

Tamamen statik HTML/CSS/JS ile hazırlanmış kurumsal site. Herhangi bir backend veya build aracı gerektirmez.

## GitHub Pages'e Yayınlama

1. Bu klasörü bir GitHub reposuna yükleyin
2. Repo ayarlarından **Settings → Pages** bölümüne gidin
3. **Source** olarak `main` branch / `/ (root)` seçin
4. Kaydedin — birkaç dakika içinde siteniz `https://kullanici-adi.github.io/repo-adi/` adresinde yayında olacak

## Dosya Yapısı

```
/
├── index.html                    ← Ana sayfa
├── kurumsal.html
├── faaliyet-alanlari.html
├── projeler.html
├── proje-beypazari-ankara.html
├── proje-celik-villa-dikili.html
├── proje-begendik-loft.html
├── proje-cayyolu-ankara.html
├── proje-tek-kat-celik-yapi.html
├── medya-merkezi.html
├── uluslararasi-vizyon.html
├── iletisim.html
├── foto-video.html
├── raporlar.html
├── basinda-biz.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── images/          ← Tüm görseller
    └── docs/            ← Referans PDF
```

## İletişim Formu

İletişim formu, form verilerini ziyaretçinin varsayılan mail istemcisine aktararak `info@askininsaatmimarlik.com` adresine yönlendirir.
Sunucu taraflı form gönderimi için [Formspree](https://formspree.io) veya [Netlify Forms](https://www.netlify.com/products/forms/) entegrasyonu eklenebilir.

## Özellikler

- Tam responsive tasarım (mobil, tablet, masaüstü)
- Scroll animasyonları ve sayfa geçiş efektleri
- Lightbox galeri (JavaScript, harici kütüphane gerektirmez)
- Yapışkan (sticky) navigasyon başlığı
- Mobil hamburger menü
- İletişim formu (mailto yönlendirmeli)
