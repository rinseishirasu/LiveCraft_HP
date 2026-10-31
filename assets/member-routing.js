/* Live Craft Ver.4.3: static, GitHub Pages-compatible public member links. */
(() => {
  'use strict';
  const validId = s => typeof s === 'string' && /^[a-z0-9][a-z0-9-]{0,59}$/.test(s) ? s : null;
  const generation = m => Number.isSafeInteger(m.generation) && m.generation > 0 ? m.generation : 0;
  const key = m => validId(m.id) || `g${generation(m)}-${encodeURIComponent(m.name.trim().normalize('NFC'))}`;
  const publicMembers = () => Array.isArray(window.LIVE_CRAFT_MEMBERS)
    ? window.LIVE_CRAFT_MEMBERS.filter(m => m && m.published === true && typeof m.name === 'string' && m.name.trim())
    : [];
  const urlFor = m => {
    const u = new URL('member.html', document.baseURI);
    u.searchParams.set('id', key(m));
    return u.href;
  };
  const palette = ['#7456E8','#13A8A2','#F06A92','#E4A52C','#4C89E7','#A96BE4','#43A76A'];
  const themeColor = m => /^#[0-9a-fA-F]{6}$/.test(m.memberColor || '') ? m.memberColor : (generation(m) ? palette[(generation(m)-1)%palette.length] : '#7456E8');
  const safeAvatar = path => typeof path === 'string' && /^assets\/members\/[a-zA-Z0-9_.-]+\.(png|jpg|jpeg|webp|avif)$/.test(path) ? path : null;
  const xShare = (m, url=urlFor(m)) => `https://twitter.com/intent/tweet?${new URLSearchParams({text:`${m.name} | Live Craft`,url}).toString()}`;
  window.LiveCraftMembers = Object.freeze({key, publicMembers, urlFor, themeColor, safeAvatar, xShare});
})();
