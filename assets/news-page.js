/* Live Craft NEWS and HOME renderer. Plain text only, no untrusted HTML injection. */
(() => {'use strict';
const C=window.LCContent; if(!C)return;
const {create,https,date,empty,image,records}=C;
const list=records('LIVE_CRAFT_NEWS').filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date||'')&&typeof x.title==='string'&&x.title.trim()).sort((a,b)=>b.date.localeCompare(a.date));
const feed=document.getElementById('news-feed');
if(feed){const bar=document.getElementById('news-filters'),search=document.getElementById('news-search');const cats=['すべて',...new Set(list.map(x=>x.category||'お知らせ'))];let active='すべて';
 if(bar&&cats.length>1){bar.hidden=false;cats.forEach(cat=>{const b=create('button','news-filter',cat);b.type='button';b.setAttribute('aria-pressed',String(cat===active));b.addEventListener('click',()=>{active=cat;bar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});bar.append(b);});}
 const render=()=>{const q=(search?.value||'').trim().toLocaleLowerCase('ja');const filtered=list.filter(x=>(active==='すべて'||(x.category||'お知らせ')===active)&&[x.title,x.summary,...(Array.isArray(x.body)?x.body:[])].join(' ').toLocaleLowerCase('ja').includes(q));feed.replaceChildren();for(const item of filtered){const d=document.createElement('details');d.className='news-entry lc44-news-entry';
 const sum=document.createElement('summary');const meta=create('span','news-entry-meta');const time=create('time','news-date',date(item.date));time.dateTime=item.date;meta.append(time,create('span','news-category',item.category||'お知らせ'));
 const info=create('span','lc44-news-title-wrap');if(C.thumb(item.thumbnail)){const icon=create('span','lc44-news-thumb');icon.append(image(item.thumbnail));info.append(icon);}info.append(create('span','news-entry-title',item.title));
 sum.append(meta,info,create('span','news-entry-arrow','↗'));d.append(sum);const body=create('div','news-entry-body');for(const p of (Array.isArray(item.body)&&item.body.length?item.body:[item.summary||'']))if(typeof p==='string'&&p.trim())body.append(create('p','',p));
 if(https(item.link)){const a=create('a','text-link','関連リンクを開く ↗');a.href=https(item.link);a.target='_blank';a.rel='noopener noreferrer';body.append(a);}
 if(typeof item.id==='string'&&/^[a-z0-9-]{1,64}$/.test(item.id)){const a=create('a','text-link','この記事を共有・詳しく見る ↗');a.href='news-article.html?id='+encodeURIComponent(item.id);body.append(a);}
 d.append(body);feed.append(d);}if(!filtered.length)empty(feed,list.length?'該当するお知らせはありません':'最初のお知らせを準備しています。','お知らせが公開され次第、こちらでご案内します。');};search?.addEventListener('input',render);render();}
const home=document.getElementById('home-news-feed');if(home&&list.length){home.replaceChildren();list.slice(0,3).forEach(item=>{const a=create('a','home-news-item');a.href=/^[a-z0-9-]{1,64}$/.test(item.id||'')?'news-article.html?id='+encodeURIComponent(item.id):'news.html';a.append(create('span','home-news-date',date(item.date)),create('span','home-news-cat',item.category||'お知らせ'),create('span','home-news-title',item.title),create('span','home-news-arrow','↗'));home.append(a);});}
})();
