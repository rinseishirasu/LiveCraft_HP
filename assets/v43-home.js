/* Featured members on HOME: featured:true first, fallback to published order. */
(() => {
  'use strict';
  const preview = document.getElementById('home-member-preview');
  const caption = document.getElementById('home-member-caption');
  const tag = document.getElementById('home-member-feature-tag');
  if (!preview || !caption || !window.LiveCraftMembers) return;
  const members = window.LiveCraftMembers.publicMembers();
  if (!members.length) return;
  const picked = members.filter(m => m.featured === true);
  const selection = (picked.length ? picked : members).slice(0, 4);
  const cards = selection.map(m => {
    const a = document.createElement('a');
    a.className = 'v41-home-talent-card v41-home-real-member lc43-featured-card';
    a.href = window.LiveCraftMembers.urlFor(m);
    a.setAttribute('aria-label', `${m.name}の個別プロフィールへ`);
    a.style.setProperty('--preview-accent',window.LiveCraftMembers.themeColor(m));
    const visual = document.createElement('span'); visual.className = 'v41-home-talent-visual';
    const avatar=window.LiveCraftMembers.safeAvatar(m.avatar);
    if (avatar) {
      const img=document.createElement('img'); img.src=avatar; img.alt=''; img.loading='lazy';
      img.addEventListener('error',()=>{visual.textContent=[...m.name].slice(0,2).join('');},{once:true});
      visual.append(img);
    } else visual.textContent=[...m.name].slice(0,2).join('');
    const name=document.createElement('span'); name.className='v41-home-talent-name'; name.textContent=m.name;
    const gen=document.createElement('span'); gen.className='lc43-feature-generation';
    gen.textContent=Number.isSafeInteger(m.generation)&&m.generation>0?`${m.generation}期生`:'MEMBER';
    a.append(visual, name, gen);
    return a;
  });
  preview.replaceChildren(...cards);
  caption.textContent=`MEMBER PROFILES / 公開中 ${members.length}名`;
  if(tag) tag.textContent=picked.length?'PICK UP MEMBERS':'MEET OUR MEMBERS';
})();
