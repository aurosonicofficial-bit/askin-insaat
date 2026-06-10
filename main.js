document.addEventListener('DOMContentLoaded', () => {

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

});
