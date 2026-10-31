/* Live Craft V4 / small progressive enhancements. All functionality works without this file. */
(() => {
 'use strict';
 const year = document.getElementById('copyright-year');
 if(year) year.textContent = String(new Date().getFullYear());
 // Links are local HTML pages; no JS router or build process required for GitHub Pages.
 // Reveal only after DOM paint; respects reduce motion, without hiding core content.
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (reduce || !('IntersectionObserver' in window)) return;
 const targets = [...document.querySelectorAll('.v4-page-decoration,.generation-toolbar,.home-news-head')];
 const io = new IntersectionObserver(entries => {
  for (const entry of entries) if(entry.isIntersecting){entry.target.classList.add('v4-revealed');io.unobserve(entry.target);}
 },{threshold:.1});
 targets.forEach(t=>io.observe(t));
})();
