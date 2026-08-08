document.addEventListener('DOMContentLoaded', () => {

  // ── WebP otomatik yükseltme (performans / LCP) ───────────────
  // Optimize edilmiş görsellerin .webp sürümü varsa <img>'leri otomatik
  // webp'ye çevirir; webp yüklenemezse sessizce orijinale döner.
  // Statik + dinamik (çelik ev galerisi, lightbox) tüm görselleri kapsar.
  (async () => {
    let webpSet;
    try {
      const res = await fetch('assets/images/webp-manifest.json', { cache: 'force-cache' });
      webpSet = new Set(await res.json());
    } catch (_) { return; }

    const toWebp = (src) => {
      if (!src) return null;
      const i = src.indexOf('assets/images/');         // mutlak URL de gelebilir
      if (i === -1) return null;
      const rel = src.slice(i);
      if (!/\.(jpe?g|png)$/i.test(rel)) return null;
      const webp = rel.replace(/\.(jpe?g|png)$/i, '.webp');
      return webpSet.has(webp) ? webp : null;
    };

    const upgrade = (img) => {
      // 8 Agu 2026: statik gorseller artik HTML'de <picture>+<source webp>
      // ile geliyor; tarayici webp'yi zaten sectí. Burada src'yi degistirmek
      // AYNI gorseli BIR KEZ DAHA indirtir. Sadece JS ile olusturulan
      // gorseller (galeri lightbox) bu yoldan gecmeli.
      if (img.closest && img.closest('picture')) return;
      const cur = img.getAttribute('src');
      if (!cur || img.dataset.webpFail === cur) return; // bu kaynak için webp başarısız olmuştu
      const webp = toWebp(cur);
      if (!webp) return;
      img.addEventListener('error', () => { img.dataset.webpFail = cur; img.src = cur; }, { once: true });
      img.src = webp;
    };

    document.querySelectorAll('img').forEach(upgrade);
    // dinamik eklenen/değişen görseller için izle (galeri kartları, lightbox)
    new MutationObserver((muts) => {
      muts.forEach((m) => {
        if (m.type === 'attributes' && m.target.tagName === 'IMG') { upgrade(m.target); return; }
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') upgrade(n);
          else if (n.querySelectorAll) n.querySelectorAll('img').forEach(upgrade);
        });
      });
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  })();

  // ── Mobil menü ──────────────────────────────────────────────
  const btn = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if(btn && nav){
    btn.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', e => {
      if(!nav.contains(e.target) && !btn.contains(e.target)) nav.classList.remove('open');
    });
  }

  // ── Header scroll efekti ─────────────────────────────────────
  const header = document.querySelector('.site-header');
  if(header){
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, {passive:true});
  }

  // ── Scroll Reveal ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── Sayı sayaç animasyonu (metric-card) ─────────────────────
  function animateCounter(el, target, suffix){
    const start = performance.now();
    const duration = 1600;
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = current + suffix;
      if(progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(update);
  }

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)/);
        if(match){
          const suffix = text.replace(match[1], '');
          animateCounter(el, parseInt(match[1]), suffix);
        }
        counterIO.unobserve(el);
      }
    });
  }, {threshold:0.5});
  document.querySelectorAll('.metric-card strong').forEach(el => counterIO.observe(el));

  // ── Galeri lightbox (basit) ──────────────────────────────────
  const galleryLinks = document.querySelectorAll('.gallery a');
  if(galleryLinks.length){
    const overlay = document.createElement('div');
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:999;align-items:center;justify-content:center;cursor:zoom-out;animation:fadeInUp .2s ease;';
    const img = document.createElement('img');
    img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 0 80px rgba(0,0,0,.8);';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    galleryLinks.forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        img.src = a.href;
        overlay.style.display = 'flex';
      });
    });
    overlay.addEventListener('click', () => overlay.style.display = 'none');
    document.addEventListener('keydown', e => { if(e.key==='Escape') overlay.style.display='none'; });
  }

  // ── Aktif nav linkini işaretle ───────────────────────────────
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    if(a.getAttribute('href') === page) a.classList.add('active');
  });

  // ── Yüzen WhatsApp butonu (tüm sayfalarda) ───────────────────
  // Türkiye'de inşaat/müteahhitlik işinde en yüksek dönüşümlü lead kanalı.
  const WA_PHONE = '905320606612';
  const WA_TEXT  = encodeURIComponent('Merhaba, web siteniz üzerinden proje/teklif hakkında bilgi almak istiyorum.');
  if(!document.querySelector('.wa-float')){
    const wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = `https://wa.me/${WA_PHONE}?text=${WA_TEXT}`;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'WhatsApp ile iletişime geçin');
    wa.innerHTML = `
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="currentColor">
        <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2 7.7L.5 31.5l8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.8 1.3 1.3-4.6-.3-.5c-1.3-2.1-2-4.5-2-7 0-7.2 5.9-13 13-13s13 5.8 13 13-5.8 13.9-13 13.9zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z"/>
      </svg>
      <span class="wa-float-label">WhatsApp</span>`;
    document.body.appendChild(wa);
  }

});

/* ---- Google Ads donusum olcumu (telefon / WhatsApp tiklamalari) ----
   Etiket <head>'de yuklu (AW-10888629695). Burasi sadece "ne zaman sayilacagini" soyler.
   Form gonderimi iletisim.html icinde, gonderim BASARILI olunca ateslenir. */
(function () {
  var HEDEF = {
    telefon:  'AW-10888629695/Bm8ACI2Th9IcEL-bjcgo',
    whatsapp: 'AW-10888629695/YpRPCJCTh9IcEL-bjcgo'
  };

  window.auraDonusum = function (hedef) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', { send_to: hedef });
  };

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.slice(0, 4) === 'tel:') {
      window.auraDonusum(HEDEF.telefon);
    } else if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp.com') > -1) {
      window.auraDonusum(HEDEF.whatsapp);
    }
  }, true);
})();
