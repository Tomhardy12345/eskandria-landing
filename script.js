// ============================================================================
// Eskandria — language toggle + GSAP scroll animations
// ============================================================================

// --- Language toggle (EN/DE) --------------------------------------------
(function initLangToggle() {
  const html = document.documentElement;
  const btn = document.getElementById('lang-toggle');
  const STORAGE_KEY = 'eskandria-lang';

  function setLang(lang) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'de') setLang(saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-lang') === 'en' ? 'de' : 'en';
    setLang(next);
  });
})();

// --- GSAP scroll animations ----------------------------------------------
// Progressive enhancement: styles.css only hides .gsap-reveal elements once
// `.js-ready` is on <html>, so nothing is invisible if this script fails.
(function initScrollAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js-ready');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    gsap.set('.gsap-reveal', { opacity: 1, y: 0 });
    return;
  }

  // Hero: staged entrance on load (eyebrow -> headline lines -> sub -> CTAs)
  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
    .to('[data-gsap="hero-eyebrow"]', { opacity: 1, y: 0 })
    .to('[data-gsap="hero-line"]', { opacity: 1, y: 0, stagger: 0.12 }, '-=0.5')
    .to('[data-gsap="hero-sub"]', { opacity: 1, y: 0 }, '-=0.4')
    .to('[data-gsap="hero-cta"]', { opacity: 1, y: 0 }, '-=0.5');

  // Hero figure: subtle parallax drift as the hero scrolls out of view
  const heroFigure = document.querySelector('[data-gsap-parallax]');
  if (heroFigure) {
    gsap.to(heroFigure, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Generic chapter reveal: fade + rise as each chapter block enters the viewport
  document.querySelectorAll('[data-gsap="chapter"]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });

  // Staggered groups: dish rows, feature cells
  document.querySelectorAll('[data-gsap-stagger]').forEach((group) => {
    const items = group.querySelectorAll('.gsap-reveal');
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });
})();

// ----------------------------------------------------------------------------
// Extension points for the developer:
// - Swap .media-placeholder blocks for <img>/<video> (keep the .blueprint
//   wrapper + corner marks; add a duotone filter/overlay to match .duotone).
// - Hero video: replace the .hero-figure placeholder with an autoplaying,
//   muted, looping <video> and re-apply the parallax ScrollTrigger to it.
// - Nav: consider a scroll-triggered background/opacity change once the
//   hero scrolls past (ScrollTrigger toggleClass on `.nav`).
// - Chapter pinning: if a chapter should "hold" while its content animates
//   (e.g. dishes cycling in), use ScrollTrigger `pin: true` on that section
//   with a nested timeline, rather than the simple reveal used here.
// ----------------------------------------------------------------------------
