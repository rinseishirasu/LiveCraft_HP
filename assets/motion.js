/* LIVE CRAFT / motion system. No external libraries or dependencies. */
(() => {
  'use strict';
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const noMotion = () => media.matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.reading-progress > span');
  let ticking = false;
  const updateScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 28);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.transform = `scaleX(${Math.max(0, Math.min(1, y / max))})`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, {passive: true});
  window.addEventListener('resize', updateScroll, {passive:true});
  updateScroll();

  // Reveal elements only if their browser supports IntersectionObserver.
  if (!noMotion() && 'IntersectionObserver' in window) {
    const targets = [
      ...document.querySelectorAll('.section-heading, .feature-split, .section .card, .section .step, .fact, .banner, .members-feature-grid, .members-empty, .members-section-head, .formbox, .prose .rule-block, .page-hero .members-hero-badge')
    ];
    targets.forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      // Stagger grid siblings, with a modest cap for a responsive feel.
      const siblings = el.parentElement;
      const index = siblings && (siblings.classList.contains('grid') || siblings.classList.contains('factbar')) ? [...siblings.children].indexOf(el) : 0;
      el.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 90}ms`);
    });
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }, {threshold:.07, rootMargin:'0px 0px -42px 0px'});
    targets.forEach(el => io.observe(el));
    document.documentElement.classList.add('motion-ready');
    // Avoid leaving sections hidden after viewport/resizing oddities.
    media.addEventListener?.('change', () => {
      if (noMotion()) {
        document.documentElement.classList.remove('motion-ready');
        io.disconnect();
      }
    });
  }

  // Pointer parallax on the hero mark. Kept subtle for readability and performance.
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('[data-parallax-stage]');
  if (hero && stage && !noMotion() && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let raf = 0;
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - .5);
      const ny = ((event.clientY - rect.top) / rect.height - .5);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stage.style.transform = `perspective(900px) translate3d(${(nx * 9).toFixed(2)}px, ${(ny * 9).toFixed(2)}px, 0) rotateX(${(-ny * 3).toFixed(2)}deg) rotateY(${(nx * 3).toFixed(2)}deg)`;
      });
    }, {passive:true});
    hero.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      stage.style.transform = '';
    });
  }

  // Lightweight decorative spotlight, no continuous animation loop.
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !noMotion()) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--px', `${event.clientX - rect.left}px`);
        card.style.setProperty('--py', `${event.clientY - rect.top}px`);
      }, {passive:true});
    });
  }
})();
