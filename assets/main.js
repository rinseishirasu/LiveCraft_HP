(() => {
  'use strict';
  const c = window.LIVE_CRAFT_CONFIG || {};
  const isHttpUrl = (url) => { try { const u = new URL(url); return ['https:', 'http:'].includes(u.protocol); } catch { return false; } };
  const open = !!c.recruitmentOpen && isHttpUrl(c.applicationUrl);
  document.querySelectorAll('[data-recruit-status]').forEach((el) => {
    el.textContent = open ? 'メンバー募集中' : '募集準備中';
    el.classList.toggle('open', open);
  });
  document.querySelectorAll('[data-application-area]').forEach((el) => {
    if (open) {
      const a = document.createElement('a');
      a.className = 'button button-primary';
      a.href = c.applicationUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = '応募フォームを開く ↗';
      el.replaceChildren(a);
    } else {
      const note = document.createElement('p');
      note.className = 'small muted';
      note.textContent = '現在は募集準備中です。応募受付の開始時にこちらからご案内します。';
      el.replaceChildren(note);
    }
  });
  document.querySelectorAll('[data-contact-area]').forEach((el) => {
    if (isHttpUrl(c.contactUrl)) {
      const a = document.createElement('a');
      a.href = c.contactUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'お問い合わせフォームを開く ↗';
      if (el.classList.contains('contact-area')) a.className = 'button button-primary';
      el.replaceChildren(a);
    } else {
      el.textContent = el.classList.contains('contact-area') ? '現在、お問い合わせ窓口を準備しています。公開後、こちらからフォームをご案内します。' : 'お問い合わせ窓口は準備中です。';
    }
  });
  document.querySelectorAll('[data-rules-date]').forEach((el) => {
    el.textContent = c.rulesEffectiveDate || '未定';
  });
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
  }
})();
