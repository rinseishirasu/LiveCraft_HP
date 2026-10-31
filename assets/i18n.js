/* Ver.5.0 bilingual navigation and core streaming experience. Japanese rules remain authoritative. */
(() => {
'use strict';
const dictionary={
 'nav.home':['HOME','HOME'],'nav.about':['ABOUT','ABOUT'],'nav.activities':['ACTIVITIES','ACTIVITIES'],'nav.members':['MEMBERS','MEMBERS'],'nav.news':['NEWS','NEWS'],'nav.join':['JOIN US','JOIN US'],'nav.schedule':['SCHEDULE','SCHEDULE'],
 'home.heroTitle':['配信を、もっと良いものへ。','Create better streams. Together.'],
 'home.heroLead':['個性が出会えば、可能性がひろがる。学び合い、磨き合い、好きな配信をもっと自由に。','When creators connect, possibilities grow. Learn, improve and create together.'],
 'home.liveTitle':['いまの配信予定。','Live plans, right now.'],
 'home.liveDisclaimer':['※LIVE表示は予定時刻に基づいています。実際の配信状態は確認していません。','Schedule-based LIVE labels are not verified livestream status.'],
 'schedules.eyebrow':['STREAM SCHEDULE','STREAM SCHEDULE'],
 'schedules.headline':['配信予定をチェック。','Discover upcoming streams.'],
 'schedules.intro':['Live Craftメンバーの公開配信予定を日本時間で表示します。予定時刻に基づく表示であり、実際の配信状況を保証するものではありません。','Browse public streaming plans from Live Craft members. Times are in Japan Standard Time. Actual broadcasts are not verified.'],
 'schedules.weekTitle':['週間配信スケジュール','Weekly stream schedule'],
 'schedules.help':['週を切り替えるか、メンバーを選んで予定を確認できます。','Switch weeks or select a member to explore their plans.'],
 'schedules.today':['今週','This week'],
 'schedules.member':['メンバー：','Member:'],
 'schedules.all':['全メンバー','All members'],
 'schedules.notice':['※「LIVE予定」は登録した開始・終了予定時刻から自動判定しています。実際の配信開始・終了を確認するものではありません。詳細は配信ページをご確認ください。','“Scheduled LIVE” is calculated from manually registered start and end times. We do not verify whether a broadcast has actually started or ended. Check the streaming page for details.'],
 'schedules.banner':['お気に入りの配信者を見つけよう。','Find your next favorite creator.'],
 'schedules.membersCTA':['メンバー一覧へ ↗','Meet the members ↗'],
 'member.next':['このメンバーの配信予定','This member’s upcoming streams'],
 'members.heading':['それぞれの色で、配信をつくる。','Every creator brings their own color.'],
 'join.heading':['次の一歩を、仲間と。','Grow with fellow creators.'],
 'site.japaneseNotice':['このページの詳細な規約・説明は日本語が正式版です。','The detailed policies and legal terms on this page are provided in Japanese; the Japanese text is authoritative.']
};
const safeStore={get(){try{return sessionStorage.getItem('lc-lang')}catch{return null}},set(x){try{sessionStorage.setItem('lc-lang',x)}catch{}}};
let current=safeStore.get()==='en'?'en':'ja';
const translate=()=>{
 document.documentElement.lang=current;
 document.querySelectorAll('[data-i18n]').forEach(node=>{const data=dictionary[node.dataset.i18n];if(data)node.textContent=data[current==='en'?1:0];});
 document.querySelectorAll('[data-lc5-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lc5Lang===current)));
 const hero=document.querySelector('[data-lc5-hero]');if(hero){if(!hero.dataset.original)hero.dataset.original=hero.innerHTML;hero.innerHTML=current==='en'?'Create better <span class="v41-gradient-word">streams. Together.</span>':hero.dataset.original;}
 const heroLead=document.querySelector('[data-lc5-hero-lead]');if(heroLead){if(!heroLead.dataset.original)heroLead.dataset.original=heroLead.innerHTML;heroLead.textContent=current==='en'?'When creators connect, possibilities grow. Learn, improve and create together. Live Craft is a community for streamers.':'';if(current==='ja')heroLead.innerHTML=heroLead.dataset.original;}
 document.querySelectorAll('[data-lc5-en-heading]').forEach(node=>{if(!node.dataset.lc5OriginalHtml)node.dataset.lc5OriginalHtml=node.innerHTML;if(current==='en')node.textContent=node.dataset.lc5EnHeading;else node.innerHTML=node.dataset.lc5OriginalHtml;});
 // All pages retain the Japanese official governance wording. Clearly label on English view.
 document.querySelectorAll('[data-lc5-japanese-note]').forEach(b=>{b.hidden=current!=='en';b.textContent=dictionary['site.japaneseNotice'][1];});
 document.dispatchEvent(new CustomEvent('lc:language-change',{detail:{lang:current}}));
};
window.LC_I18N=Object.freeze({lang:()=>current,t:(key)=>dictionary[key]?.[current==='en'?1:0]||key,set(v){if(v!=='ja'&&v!=='en')return;current=v;safeStore.set(current);translate();}});
document.querySelectorAll('[data-lc5-lang]').forEach(b=>b.addEventListener('click',()=>window.LC_I18N.set(b.dataset.lc5Lang)));
translate();
})();
