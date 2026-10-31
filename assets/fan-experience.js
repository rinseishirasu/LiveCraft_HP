/* Live Craft 6.2 / public fan guide, external links and anniversaries. No authentication, tracking or API. */
(() => {
 'use strict';
 const members=()=>window.LiveCraftMembers?.publicMembers?.() || (Array.isArray(window.LIVE_CRAFT_MEMBERS)?window.LIVE_CRAFT_MEMBERS.filter(m=>m&&m.published===true&&m.id&&m.name):[]);
 const tr=(ja,en)=>window.LC_I18N?.lang?.()==='en'?en:ja;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n;};
 const https=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}};
 const profile=m=>window.LiveCraftMembers?.urlFor?.(m)||'member.html?id='+encodeURIComponent(m.id);
 const icon=m=>{const p=window.LiveCraftMembers?.safeProfileIcon?.(m);if(!p)return null;const im=el('img');im.src=p;im.alt='';im.loading='lazy';im.decoding='async';return im;};
 const link=(href,label,cls='lc62-link')=>{const a=el('a',cls,label);a.href=href;if(/^https:\/\//.test(href)){a.target='_blank';a.rel='noopener noreferrer';}return a;};
 // A self-contained SVG share card; no account, payment, member data upload or external assets.
 const escapeXml=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
 function cardSvg(m){
   const name=escapeXml(String(m.name||'Live Craft').slice(0,42));
   const fan=escapeXml(String(m.fanMark||'✳').slice(0,14));
   const accent=/^#[a-fA-F0-9]{6}$/.test(m.memberColor||'')?m.memberColor:'#9A82DB';
   return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Live Craft 応援カード"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FCF8FF"/><stop offset="1" stop-color="#FCEEEF"/></linearGradient></defs><rect width="1200" height="630" rx="42" fill="url(#g)"/><circle cx="1080" cy="98" r="165" fill="${accent}" opacity=".22"/><circle cx="112" cy="560" r="185" fill="#A4DED4" opacity=".32"/><rect x="68" y="68" width="1064" height="494" rx="32" fill="#FFFFFF" opacity=".88"/><text x="118" y="143" font-family="sans-serif" font-size="31" font-weight="800" letter-spacing="4" fill="#665088">LIVE CRAFT  /  FAN SHARE CARD</text><text x="116" y="340" font-family="sans-serif" font-size="66" font-weight="900" textLength="950" lengthAdjust="spacingAndGlyphs" fill="#32274F">${name}</text><text x="116" y="434" font-family="sans-serif" font-size="62" fill="${accent}">${fan}</text><text x="118" y="518" font-family="sans-serif" font-size="24" fill="#665D74">応援する気持ちをシェア。会員証・公式認証ではありません。</text></svg>`;
 }
 function downloadCard(m){const blob=new Blob([cardSvg(m)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download=`livecraft-fan-${String(m.id||'creator').replace(/[^a-z0-9-]/g,'')}.svg`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const pill=(label,value)=>{const n=el('span','lc62-guide-pill');n.append(el('small','',label),el('strong','',value));return n;};
 function guide(m){const article=el('article','lc62-fan-card');const head=el('div','lc62-fan-card-head'),image=el('span','lc62-fan-avatar');const avatar=icon(m);if(avatar)image.append(avatar);else image.textContent='LC';head.append(image);const info=el('div');info.append(el('h3','',m.name),el('span','lc62-muted',m.primaryPlatform||tr('配信クリエイター','Streamer')));head.append(info);article.append(head);
   const chips=el('div','lc62-guide-chips');for(const [label,value] of [[tr('ファンネーム','Fan name'),m.fanName],[tr('ファンマーク','Fan mark'),m.fanMark],[tr('配信タグ','Stream tag'),m.streamTag],[tr('ファンアートタグ','Fan art tag'),m.fanArtTag]]){if(typeof value==='string'&&value.trim())chips.append(pill(label,value.slice(0,90)));}if(chips.childNodes.length)article.append(chips);else article.append(el('p','lc62-muted',tr('応援情報は準備中です。','Fan guide details coming soon.')));
   const actions=el('div','lc62-fan-actions');actions.append(link(profile(m),tr('プロフィールを見る ↗','View profile ↗')));
   const club=https(m.fanClubUrl);if(club)actions.append(link(club,(m.fanClubLabel||tr('公式ファンクラブ','Fan club')).slice(0,65)+' ↗','lc62-link lc62-link-accent'));
   const platform=https(m.primaryPlatformUrl);if(platform)actions.append(link(platform,tr('配信先へ ↗','Stream channel ↗')));
   const rules=https(m.fanGuidelinesUrl);if(rules)actions.append(link(rules,tr('本人の二次創作ガイドライン ↗','Creator fan-art guidelines ↗')));
   const save=el('button','lc62-link lc62-share-card',tr('応援カードを保存 ↓','Save fan card ↓'));save.type='button';save.addEventListener('click',()=>downloadCard(m));actions.append(save);article.append(actions);return article;
 }
 function anniversaries(now=new Date()){
   const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).reduce((o,p)=>(o[p.type]=p.value,o),{});
   const current=`${today.year}-${today.month}-${today.day}`, year=Number(today.year), events=[];
   for(const m of members()){
     const add=(kind,md,baseYear)=>{if(!/^\d{2}-\d{2}$/.test(md||''))return;for(const y of [year,year+1]){const d=`${y}-${md}`;const ms=Date.parse(d+'T00:00:00+09:00');if(!Number.isFinite(ms)||new Date(ms+9*3600000).toISOString().slice(0,10)!==d||d<current||ms-Date.parse(current+'T00:00:00+09:00')>366*86400000)continue;if(baseYear&&y<baseYear)continue;events.push({member:m,kind,date:d,years:baseYear?y-baseYear:null});break;}};
     if(typeof m.birthday==='string')add('birthday',m.birthday,null);
     if(typeof m.debutDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(m.debutDate))add('debut',m.debutDate.slice(5),Number(m.debutDate.slice(0,4)));
   }
   return events.sort((a,b)=>a.date.localeCompare(b.date)||a.member.name.localeCompare(b.member.name));
 }
 function renderAnniversary(host,limit=0){if(!host)return;const data=anniversaries().slice(0,limit||300);host.replaceChildren();if(!data.length){host.append(el('div','lc62-empty',tr('公開されている記念日はまだありません。メンバーが誕生日やデビュー日を登録すると表示されます。','No public anniversaries yet.')));return;}
  for(const x of data){const row=el('a','lc62-anniversary-item');row.href=profile(x.member);row.append(el('span','lc62-anniversary-icon',x.kind==='birthday'?'🎂':'✧'));const d=el('span','lc62-anniversary-content');d.append(el('small','',x.date.slice(5).replace('-','/')+' / '+x.date.slice(0,4)),el('strong','',x.member.name),el('span','',x.kind==='birthday'?tr('お誕生日','Birthday'):x.years===0?tr('デビュー日','Debut day'):tr(`デビュー${x.years}周年`,`Debut anniversary ${x.years}`)));row.append(d,el('span','lc62-anniversary-go','↗'));host.append(row);}
 }
 const hub=document.querySelector('[data-lc62-fan-list]');const search=document.querySelector('[data-lc62-fan-search]');const count=document.querySelector('[data-lc62-fan-count]');
 const renderHub=()=>{if(!hub)return;const q=(search?.value||'').normalize('NFKC').toLocaleLowerCase().trim();const data=members().filter(m=>[m.name,m.fanName,m.fanMark,m.streamTag,m.fanArtTag,m.primaryPlatform].join(' ').normalize('NFKC').toLocaleLowerCase().includes(q));hub.replaceChildren(...data.map(guide));if(!data.length)hub.append(el('p','lc62-empty',tr('一致するメンバーはいません。','No matching creators.')));if(count)count.textContent=tr(`${data.length}名のメンバー`,` ${data.length} creators`);};
 if(hub){search?.addEventListener('input',renderHub);renderHub();document.addEventListener('lc:language-change',renderHub);}
 const detail=document.querySelector('[data-lc62-member-fan]');if(detail){const id=new URLSearchParams(location.search).get('id');const m=members().find(x=>(window.LiveCraftMembers?.key?.(x)||x.id)===id);if(m){detail.append(guide(m));detail.hidden=false;}}
 renderAnniversary(document.querySelector('[data-lc62-anniversaries]'));
 renderAnniversary(document.querySelector('[data-lc62-home-anniversaries]'),3);
 window.LC62Fan=Object.freeze({anniversaries,https,cardSvg});
 document.addEventListener('lc:language-change',()=>{renderAnniversary(document.querySelector('[data-lc62-anniversaries]'));renderAnniversary(document.querySelector('[data-lc62-home-anniversaries]'),3);});
})();
