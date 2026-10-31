/* Plain-text safe NEWS renderer shared by HOME and NEWS. */
(() => {
  'use strict';
  const list = (Array.isArray(window.LIVE_CRAFT_NEWS) ? window.LIVE_CRAFT_NEWS : [])
    .filter(x => x && x.published === true && /^\d{4}-\d{2}-\d{2}$/.test(x.date || '') && typeof x.title === 'string' && x.title.trim())
    .sort((a,b) => b.date.localeCompare(a.date));
  const text = (tag, cls, value) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    el.textContent = String(value || '');
    return el;
  };
  const isLink = url => { try { const u = new URL(url); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; } };
  const displayDate = date => date.replaceAll('-', '.');
  const feed = document.getElementById('news-feed');
  if (feed && list.length) {
    const filterBar = document.getElementById('news-filters');
    const cats = ['すべて', ...new Set(list.map(x => String(x.category || 'お知らせ')))];
    let active = 'すべて';
    const render = () => {
      feed.replaceChildren();
      list.filter(x => active === 'すべて' || String(x.category || 'お知らせ') === active).forEach((item, index) => {
        const d = document.createElement('details');d.className = 'news-entry';
        const summary = document.createElement('summary');
        const meta = text('span','news-entry-meta','');
        const time = text('time','news-date',displayDate(item.date));time.dateTime = item.date;
        const category = text('span','news-category',item.category || 'お知らせ');
        meta.append(time,category);
        const title = text('span','news-entry-title',item.title);
        const arrow = text('span','news-entry-arrow','↗');arrow.setAttribute('aria-hidden','true');
        summary.append(meta,title,arrow);d.append(summary);
        const body = document.createElement('div');body.className = 'news-entry-body';
        const para = Array.isArray(item.body) ? item.body : [];
        (para.length ? para : (item.summary ? [item.summary] : [])).forEach(p => { if(typeof p === 'string' && p.trim()) body.append(text('p','',p)); });
        if (isLink(item.link)) { const a = text('a','text-link','関連リンクを開く ↗');a.href = item.link;a.target='_blank';a.rel='noopener noreferrer';body.append(a); }
        d.append(body);feed.append(d);
      });
    };
    if (filterBar && cats.length > 2) {
      filterBar.hidden = false;
      cats.forEach(cat => {
        const button = text('button','news-filter',cat);
        button.type='button';button.setAttribute('aria-pressed',String(cat===active));
        button.addEventListener('click', () => {
          active=cat;
          filterBar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
          render();
        });
        filterBar.append(button);
      });
    }
    render();
  }
  const home = document.getElementById('home-news-feed');
  if(home && list.length){
    home.replaceChildren();
    list.slice(0,3).forEach(item => {
      const a = document.createElement('a');a.href = 'news.html';a.className='home-news-item';
      a.append(text('span','home-news-date',displayDate(item.date)), text('span','home-news-cat',item.category||'お知らせ'), text('span','home-news-title',item.title));
      const icon = text('span','home-news-arrow','↗');icon.setAttribute('aria-hidden','true');a.append(icon);
      home.append(a);
    });
  }
})();
