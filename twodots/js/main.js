/* ============================================================
   TWODOTS DENTAL CLINIC — Single Page JS
============================================================ */
(function () {
  'use strict';

  // ── Navbar scroll ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Active nav link on scroll ─────────────────────────────
  const sections = document.querySelectorAll('section[id], div[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-60px 0px -60px 0px' });

  sections.forEach(s => sectionObs.observe(s));

  // ── Mobile Drawer ─────────────────────────────────────────
  const hamburger     = document.getElementById('hamburger');
  const mobileDrawer  = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose   = document.getElementById('drawerClose');

  function openDrawer()  { mobileDrawer?.classList.add('open'); drawerOverlay?.classList.add('open'); hamburger?.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeDrawer() { mobileDrawer?.classList.remove('open'); drawerOverlay?.classList.remove('open'); hamburger?.classList.remove('open'); document.body.style.overflow=''; }

  hamburger?.addEventListener('click', () => mobileDrawer?.classList.contains('open') ? closeDrawer() : openDrawer());
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);
  // Close drawer and smooth scroll when a drawer link is clicked
  mobileDrawer?.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => closeDrawer());
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  // ── Smooth scroll for all anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Scroll Reveal ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  // ── Count-up Animation ────────────────────────────────────
  const counters = document.querySelectorAll('.count-up[data-target]');
  if (counters.length) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;
        const duration = 1800;
        const startTime = performance.now();
        function step(now) {
          const p = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const cur = Math.floor(ease * target);
          el.textContent = target >= 1000 ? (cur >= 1000 ? Math.floor(cur/1000)+'k' : cur)+suffix : cur+suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target >= 1000 ? Math.floor(target/1000)+'k'+suffix : target+suffix;
        }
        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }

  // ── Lightbox ──────────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => {
        lightboxImg.src = el.dataset.lightbox || el.src || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLb = () => { lightbox.classList.remove('open'); document.body.style.overflow=''; setTimeout(()=>{lightboxImg.src='';},300); };
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    lightboxClose?.addEventListener('click', closeLb);
    document.addEventListener('keydown', e => { if (e.key==='Escape' && lightbox.classList.contains('open')) closeLb(); });
  }

  // ── Footer year ───────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();

// ── WhatsApp button — hide during hero, show after ────────────────────────
(function() {
  const floatWa = document.getElementById('floatWa');
  const hero = document.getElementById('hero');
  if (!floatWa || !hero) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      // Add hero-hidden class when hero is intersecting (visible), remove when scrolled past
      floatWa.classList.toggle('hero-hidden', e.isIntersecting);
    });
  }, { threshold: 0.1 });
  obs.observe(hero);
})();
