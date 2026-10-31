/* Live Craft Ver.6.0: public-content discovery, entirely local, no third-party API. */
(() => {
 'use strict';
 const host=document.querySelector('[data-lc6-discover-results]');if(!host)return;
 const C=window.LCContent;const M=window.LiveCraftMembers;if(!C||!M)return;
 const safeId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9-]{0,63}$/.test(id);
 const safeExternal=url=>C.https(url);
 const lang=()=>window.LC_I18N?.lang?.()==='en';
 const tr=(ja,en)=>lang()?en:ja;
 const params=new URLSearchParams(location.search);
 const qInput=document.querySelector('[data-lc6-discover-query]');
 const controls=document.querySelector('[data-lc6-discover-tabs]');
 const summary=document.querySelector('[data-lc6-discover-summary]');
 const empty=document.querySelector('[data-lc6-discover-empty]');
 const tabs=['all','member','news','video','event','collab','project'];
 const names={all:['すべて','All'],member:['メンバー','Members'],news:['NEWS','News'],video:['動画','Videos'],event:['イベント','Events'],collab:['コラボ','Collabs'],project:['企画','Projects']};
 const source=(key)=>C.records(key);
 const memberItems=M.publicMembers().map(m=>({kind:'member',title:m.name,subtitle:[m.agency,m.primaryPlatform,m.genres?.join('・')].filter(Boolean).join(' / '),description:[m.bio,m.catchphrase,m.fanName].filter(Boolean).join(' '),url:M.urlFor(m),date:'',image:M.safeProfileIcon(m),terms:[m.name,m.agency,m.primaryPlatform,m.bio,m.catchphrase,m.role,...(m.genres||[]),...(m.hobbies||[])].join(' ')}));
 const newsItems=source('LIVE_CRAFT_NEWS').filter(x=>x.title).map(x=>({kind:'news',title:x.title,subtitle:x.category||'',description:x.summary||'',date:x.date||'',url:safeId(x.id)?'news-article.html?id='+encodeURIComponent(x.id):'news.html',image:C.thumb(x.thumbnail),terms:[x.title,x.summary,x.category,...(Array.isArray(x.body)?x.body:[])].join(' ')}));
 const other=(key,kind,fallback)=>source(key).filter(x=>x.title).map(x=>({kind,title:x.title,subtitle:[x.platform,x.category,x.type].filter(Boolean).join(' / '),description:x.description||'',date:x.date||'',url:safeExternal(x.url)||fallback,image:C.thumb(x.thumbnail),terms:[x.title,x.description,x.member,x.platform,x.category,x.type,...(Array.isArray(x.members)?x.members:[])].filter(Boolean).join(' ')}));
 const projectItems=source('LIVE_CRAFT_PROJECTS').filter(x=>x.title&&safeId(x.id)).map(x=>({kind:'project',title:x.title,subtitle:[x.category,x.status].filter(Boolean).join(' / '),description:x.summary||x.description||'',date:x.startDate||'',url:'project.html?id='+encodeURIComponent(x.id),image:C.thumb(x.cover),terms:[x.title,x.summary,x.description,x.category,...(Array.isArray(x.members)?x.members:[])].join(' ')}));
 const records=[...projectItems,...memberItems,...newsItems,...other('LIVE_CRAFT_VIDEOS','video','videos.html'),...other('LIVE_CRAFT_EVENTS','event','events.html'),...other('LIVE_CRAFT_COLLABS','collab','collabs.html')];
 let kind=tabs.includes(params.get('kind'))?params.get('kind'):'all';
 let query=(params.get('q')||'').slice(0,140);if(qInput)qInput.value=query;
 const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ja').trim();
 const tokens=s=>norm(s).split(/\s+/).filter(Boolean).slice(0,8);
 function search(q,filter='all') {const ts=tokens(q);return records.filter(x=>(filter==='all'||x.kind===filter)&&ts.every(t=>norm([x.title,x.subtitle,x.description,x.terms].join(' ')).includes(t)));}
 function card(x){const a=document.createElement('a');a.className='lc6-discover-card';a.href=x.url||'#';if(/^https:\/\//.test(a.href)&&new URL(a.href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer';}
  const art=document.createElement('div');art.className='lc6-discover-art';if(x.image){const img=document.createElement('img');img.src=x.image;img.alt='';img.loading='lazy';img.onerror=()=>{img.replaceWith(Object.assign(document.createElement('span'),{textContent:'✳'}));};art.append(img);}else{art.textContent='✳';}
  const body=document.createElement('div');body.className='lc6-discover-card-body';const meta=document.createElement('span');meta.className='lc6-discover-meta';meta.textContent=`${names[x.kind][lang()?1:0]} ${x.date?' / '+x.date:''}`;const h=document.createElement('h3');h.textContent=x.title;const p=document.createElement('p');p.textContent=(x.description||x.subtitle||'').slice(0,165);const arrow=document.createElement('span');arrow.className='lc6-discover-open';arrow.textContent=tr('詳しく見る ↗','Explore ↗');body.append(meta,h,p,arrow);a.append(art,body);return a;
 }
 function refreshUrl(){const u=new URL(location.href);if(query.trim())u.searchParams.set('q',query.trim());else u.searchParams.delete('q');if(kind!=='all')u.searchParams.set('kind',kind);else u.searchParams.delete('kind');try{history.replaceState(null,'',u.pathname+u.search+u.hash);}catch{}}
 function translateStatic(){const copy={heroTitle:['好きが見つかる、Live Craftの図鑑。','Find your next favorite at Live Craft.'],heroLead:['配信者も、お知らせも、動画も。公開されている活動を、ここからまとめて見つけよう。','Explore creators, news, videos, events and collaborations all in one place.'],sectionTitle:['コミュニティを探検しよう。','Explore our community.'],searchLabel:['キーワードで検索','Search by keyword']};
 document.querySelectorAll('[data-lc6-copy]').forEach(node=>{const x=copy[node.dataset.lc6Copy];if(x)node.textContent=x[lang()?1:0];});
 if(qInput)qInput.placeholder=tr('メンバー名・ゲーム・企画・プラットフォーム…','Creator, game, project, platform…');}
 function render(){translateStatic();const hits=search(query,kind);const allHits=search(query);if(controls){controls.replaceChildren();tabs.forEach(k=>{const count=k==='all'?allHits.length:allHits.filter(x=>x.kind===k).length;const b=document.createElement('button');b.type='button';b.className='lc6-discover-tab';b.setAttribute('aria-pressed',String(k===kind));b.textContent=`${names[k][lang()?1:0]} (${count})`;b.addEventListener('click',()=>{kind=k;refreshUrl();render();});controls.append(b);});}
  host.replaceChildren(...hits.map(card));if(summary)summary.textContent=tr(`${hits.length}件の公開情報が見つかりました`,`${hits.length} public result(s)`);if(empty){empty.hidden=hits.length>0;empty.textContent=records.length?tr('該当する公開情報はありません。別のキーワードを試してください。','No matches. Try other keywords.'):tr('公開コンテンツが登録されるとここに表示されます。','Published content will appear here.');}
 }
 qInput?.addEventListener('input',()=>{query=qInput.value.slice(0,140);refreshUrl();render();});
 document.addEventListener('lc:language-change',render);
 window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);query=p.get('q')||'';kind=tabs.includes(p.get('kind'))?p.get('kind'):'all';if(qInput)qInput.value=query;render();});
 window.LC6Discover=Object.freeze({search,count:()=>records.length});render();
})();
