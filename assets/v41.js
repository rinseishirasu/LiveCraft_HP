/* Ver.4.1: progressive public-member teaser on Home; no private member data. */
(() => {
  'use strict';
  const preview = document.getElementById('home-member-preview');
  const caption = document.getElementById('home-member-caption');
  if (!preview || !caption) return;
  const members = Array.isArray(window.LIVE_CRAFT_MEMBERS)
    ? window.LIVE_CRAFT_MEMBERS.filter(m => m && m.published === true && typeof m.name === 'string' && m.name.trim()) : [];
  if (!members.length) return;
  const colors = ['#7456e8', '#13a8a2', '#f06a92', '#e4a52c', '#4c89e7', '#a96be4', '#43a76a'];
  const safeAvatar = path => typeof path === 'string' && /^assets\/members\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-][a-zA-Z0-9_.-]*\.(png|jpg|jpeg|webp|avif)$/.test(path) ? path : null;
  const tiles = members.slice(0, 3).map((member, i) => {
    const a = document.createElement('a');
    a.href = 'members.html';
    a.className = 'v41-home-talent-card v41-home-real-member';
    a.setAttribute('aria-label', `${member.name}の紹介ページへ`);
    a.style.setProperty('--preview-accent', colors[((Number.isInteger(member.generation) && member.generation > 0 ? member.generation : i + 1)-1) % colors.length]);
    const art = document.createElement('span'); art.className = 'v41-home-talent-visual';
    const src = safeAvatar(member.avatar) !== safeAvatar(member.fullbody) ? safeAvatar(member.avatar) : null;
    if (src) {
      const img = document.createElement('img'); img.src = src; img.alt = ''; img.loading='lazy';
      img.onerror = () => { art.textContent = [...member.name].slice(0,2).join(''); };
      art.append(img);
    } else art.textContent = [...member.name].slice(0,2).join('');
    const name = document.createElement('span'); name.className = 'v41-home-talent-name'; name.textContent = member.name;
    a.append(art, name);return a;
  });
  preview.replaceChildren(...tiles);
  caption.textContent = `MEMBER PROFILES / 公開中 ${members.length}名`;
})();
