/* Live Craft Ver.5.0.1: full public interface localization (no automatic API translation).
 * The official Japanese legal documents remain unchanged. DOM text nodes are updated
 * in place, preserving links, event listeners, inline styling and profile widgets. */
(() => {
  'use strict';
  const translations = window.LC_TRANSLATIONS || {};
  const pageMeta = window.LC_PAGE_META || {};
  const pageName = document.body?.dataset.lcPage || location.pathname.split('/').pop() || 'index.html';
  const metaInfo = pageMeta[pageName] || ['Live Craft', 'Learn about Live Craft.'];
  const jaTitle = document.title;
  const descTag = document.querySelector('meta[name="description"]');
  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  const ogDescTag = document.querySelector('meta[property="og:description"]');
  const savedMeta = [descTag?.content, ogTitleTag?.content, ogDescTag?.content];
  const fixed = {
    'nav.home': ['HOME', 'HOME'], 'nav.about': ['ABOUT', 'ABOUT'],
    'nav.activities': ['ACTIVITIES', 'ACTIVITIES'], 'nav.members': ['MEMBERS', 'MEMBERS'],
    'nav.news': ['NEWS', 'NEWS'], 'nav.join': ['JOIN US', 'JOIN US'],
    'nav.schedule': ['SCHEDULE', 'SCHEDULE'],
    'home.liveTitle': ['いまの配信予定。', 'Live plans, right now.'],
    'home.liveDisclaimer': ['※LIVE表示は予定時刻に基づいています。実際の配信状態は確認していません。', 'LIVE labels are based on planned times; actual broadcast status is not verified.'],
    'schedules.today': ['今週', 'This week'],
    'schedules.all': ['全メンバー', 'All members'],
    'schedules.weekTitle': ['週間配信スケジュール', 'Weekly streaming schedule'],
    'member.next': ['このメンバーの配信予定', "This member's streaming schedule"],
    'site.japaneseNotice': ['この文書は日本語が正式版です。', 'This policy is provided in Japanese, which is the authoritative version.']
  };
  const store = {
    get() { try { return sessionStorage.getItem('lc-lang'); } catch { return null; } },
    set(v) { try { sessionStorage.setItem('lc-lang',v); } catch {} }
  };
  let current = store.get() === 'en' ? 'en' : 'ja';
  const textRecords = [];
  const observed = new WeakSet();
  const attrRecords = [];
  const attrObserved = new WeakMap();
  const isLegal = pageName === 'guidelines.html' || pageName === 'privacy.html';

  function track(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) addText(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) addText(walker.currentNode);
    if(root.nodeType === Node.ELEMENT_NODE){
      const nodes = [root, ...root.querySelectorAll('[placeholder], [aria-label], [title]')];
      for(const el of nodes){
        if(el.nodeType !== Node.ELEMENT_NODE) continue;
        if(el.closest('script,style,template')) continue;
        if(isLegal && el.closest('.prose')) continue;
        const tracked = attrObserved.get(el) || new Set();
        for (const attr of ['placeholder','aria-label','title']) {
          if(!el.hasAttribute(attr) || tracked.has(attr))continue;
          const jp=el.getAttribute(attr);
          const en=translations[jp?.trim()];
          if(en){attrRecords.push({el,attr,jp,en});tracked.add(attr);}
        }
        attrObserved.set(el,tracked);
      }
    }
  }
  function dynamicTranslation(value) {
    let m;
    if((m=/^(\d{1,3})期生$/.exec(value)))return `Generation ${m[1]}`;
    if((m=/^(\d+)名を表示中$/.exec(value)))return `Showing ${m[1]} member(s)`;
    if((m=/^MEMBER PROFILES \/ 公開中 (\d+)名$/.exec(value)))return `MEMBER PROFILES / ${m[1]} published`;
    if((m=/^(\d{1,2})月(\d{1,2})日$/.exec(value)))return `${m[1]}/${m[2]}`;
    if((m=/^(\d{4})年(\d{1,2})月(\d{1,2})日$/.exec(value)))return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
    return null;
  }
  function addText(node) {
    if(observed.has(node)) return;
    observed.add(node);
    const parent=node.parentElement;
    if(!parent || parent.closest('script,style,template,noscript'))return;
    if(isLegal && parent.closest('.prose'))return;
    if(parent.closest('[data-lc5-japanese-note]'))return;
    const jp=node.nodeValue;
    const content=jp.trim();
    const en=translations[content] || dynamicTranslation(content);
    if(!content || !en)return;
    textRecords.push({node, jp, en, prefix:jp.match(/^\s*/)?.[0] || '', suffix:jp.match(/\s*$/)?.[0] || ''});
  }
  function apply() {
    document.documentElement.lang=current;
    const english=current==='en';
    for(const r of textRecords){
      if(r.node.isConnected)r.node.nodeValue=english ? r.prefix+r.en+r.suffix : r.jp;
    }
    for(const r of attrRecords){
      if(r.el.isConnected)r.el.setAttribute(r.attr,english?r.en:r.jp);
    }
    document.querySelectorAll('[data-lc5-lang]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.lc5Lang===current)));
    document.querySelectorAll('[data-lc5-japanese-note]').forEach(n => {
      n.hidden=!english;
      n.textContent='The Japanese-language text is authoritative. The full policy is currently available only in Japanese.';
    });
    document.title=english ? ((pageName==='member.html' && jaTitle.includes('| MEMBERS | Live Craft')) || (pageName==='news-article.html' && jaTitle.includes('| Live Craft NEWS')) ? jaTitle : `${metaInfo[0]} | Live Craft`) : jaTitle;
    if(descTag)descTag.content=english?metaInfo[1]:savedMeta[0];
    if(ogTitleTag)ogTitleTag.content=english?`${metaInfo[0]} | Live Craft`:savedMeta[1];
    if(ogDescTag)ogDescTag.content=english?metaInfo[1]:savedMeta[2];
    document.dispatchEvent(new CustomEvent('lc:language-change',{detail:{lang:current}}));
  }
  const api=Object.freeze({
    lang:()=>current,
    t(key){ const value=fixed[key];return value ? value[current==='en'?1:0] : translations[key] || key; },
    set(v) {if(v!=='ja'&&v!=='en')return;current=v;store.set(v);track(document.body);apply();}
  });
  window.LC_I18N=api;
  track(document.body);
  document.querySelectorAll('[data-lc5-lang]').forEach(b=>b.addEventListener('click',()=>api.set(b.dataset.lc5Lang)));
  // Pick up content widgets added after initial load, without rebuilding their elements.
  const observer=new MutationObserver(changes => {
    let added=false;
    for(const change of changes){
      for(const child of change.addedNodes){track(child);added=true;}
    }
    if(added && current==='en'){
      for(const r of textRecords)if(r.node.isConnected&&r.node.nodeValue===r.jp)r.node.nodeValue=r.prefix+r.en+r.suffix;
      for(const r of attrRecords)if(r.el.isConnected&&r.el.getAttribute(r.attr)===r.jp)r.el.setAttribute(r.attr,r.en);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
  apply();
})();
