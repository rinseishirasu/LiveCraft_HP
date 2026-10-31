/* Ver.4.3 stable profile permalink and share actions. */
(() => {
  'use strict';
  const wrap=document.getElementById('lc43-profile');
  if(!wrap || !window.LiveCraftMembers || !window.LiveCraftProfileUI) return;
  const key=new URLSearchParams(window.location.search).get('id');
  const member=window.LiveCraftMembers.publicMembers().find(m=>window.LiveCraftMembers.key(m)===key);
  if(!member){
    wrap.replaceChildren();
    const box=document.createElement('div'); box.className='lc43-not-found';
    const title=document.createElement('h2'); title.textContent='プロフィールが見つかりません。';
    const p=document.createElement('p'); p.textContent='非公開になったか、URLが変更された可能性があります。';
    const a=document.createElement('a'); a.href='members.html'; a.className='button button-primary'; a.textContent='メンバー一覧を見る ↗';
    box.append(title,p,a);wrap.append(box);document.title='MEMBER NOT FOUND | Live Craft';return;
  }
  const profile=window.LiveCraftProfileUI.render(member);
  profile.classList.add('lc43-standalone-profile');
  wrap.replaceChildren(profile);
  wrap.style.setProperty('--member-accent',window.LiveCraftMembers.themeColor(member));
  document.getElementById('lc43-page-heading').textContent=member.name;
  document.getElementById('member-breadcrumb-name').textContent=member.name;
  document.title=`${member.name} | MEMBERS | Live Craft`;
  const description=document.querySelector('meta[name="description"]');
  if(description) description.content=`${member.name} | Live Craftの公式プロフィール。${String(member.catchphrase || member.bio || '').slice(0,70)}`;
  const actions=document.createElement('div');actions.className='lc43-share-actions';
  const x=document.createElement('a');x.className='lc43-action-share'; x.href=window.LiveCraftMembers.xShare(member); x.target='_blank';x.rel='noopener noreferrer';x.textContent='Xでプロフィールを共有 ↗';
  const copy=document.createElement('button');copy.type='button';copy.className='lc43-action-copy';copy.textContent='プロフィールURLをコピー';
  copy.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(window.LiveCraftMembers.urlFor(member));copy.textContent='コピーしました';}
    catch{copy.textContent='URLをコピーできませんでした';}
  });
  actions.append(x,copy);if(window.LC6Favorites){const favorite=window.LC6Favorites.createButton(member,'lc6-favorite-in-modal');actions.append(favorite);window.LC6Favorites.updateButtons();}wrap.append(actions);
})();
