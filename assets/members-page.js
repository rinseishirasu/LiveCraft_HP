(() => {
  'use strict';
  const grid = document.getElementById('member-grid');
  const empty = document.getElementById('members-empty');
  const count = document.querySelector('[data-member-count]');
  const filterWrap = document.querySelector('[data-member-filter-wrap]');
  const filter = document.querySelector('[data-member-filter]');
  const dialog = document.getElementById('member-profile-dialog');
  const dialogContent = document.getElementById('profile-dialog-content');
  const generationToolbar = document.getElementById('generation-toolbar');
  const generationFilters = document.getElementById('generation-filters');
  const resultStatus = document.getElementById('member-results-status');
  const closeButton = document.querySelector('[data-profile-close]');
  if (!grid || !empty || !count || !filterWrap || !filter || !dialog || !dialogContent || !closeButton || !generationToolbar || !generationFilters || !resultStatus) return;

  const raw = Array.isArray(window.LIVE_CRAFT_MEMBERS) ? window.LIVE_CRAFT_MEMBERS : [];
  const members = raw.filter(m => m && m.published === true && typeof m.name === 'string' && m.name.trim());
  count.textContent = String(members.length).padStart(2, '0');
  if (!members.length) return;
  empty.hidden = true;

  // 期生を持たない既存の公開データも表示し、誤った期生を推測しません。
  const generationOf = member => Number.isSafeInteger(member.generation) && member.generation > 0 && member.generation <= 999 ? member.generation : null;
  const generationLabel = generation => generation == null ? '期生未設定' : `${generation}期生`;
  const generations = [...new Set(members.map(generationOf))].sort((a, b) => a == null ? 1 : b == null ? -1 : a - b);
  let activeGeneration = 'all';

  const genres = [...new Set(members.flatMap(m => Array.isArray(m.genres) ? m.genres.filter(g => typeof g === 'string' && g.trim()) : []))];
  if (genres.length > 1) {
    filterWrap.hidden = false;
    for (const genre of genres) {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      filter.append(option);
    }
  }

  const safeUrl = url => {
    if (typeof url !== 'string') return null;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' ? parsed.href : null;
    } catch { return null; }
  };
  const avatarPath = path => typeof path === 'string' && /^assets\/members\/[a-zA-Z0-9_.-]+\.(png|jpg|jpeg|webp|avif)$/.test(path) ? path : null;
  const node = (tag, className, content) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content != null) el.textContent = String(content);
    return el;
  };
  const initials = name => [...name.trim()].slice(0, 2).join('').toUpperCase();
  const createAvatar = (member, className, eager = false) => {
    const wrap = node('span', className);
    const fallback = () => wrap.replaceChildren(node('span', 'member-initial', initials(member.name)));
    const src = avatarPath(member.avatar);
    if (!src) {
      fallback();
    } else {
      const img = node('img');
      img.src = src;
      img.alt = '';
      img.width = eager ? 280 : 180;
      img.height = eager ? 280 : 180;
      img.decoding = 'async';
      img.loading = eager ? 'eager' : 'lazy';
      img.addEventListener('error', fallback, {once: true});
      wrap.append(img);
    }
    return wrap;
  };

  let triggerButton = null;
  const showProfile = (member, trigger) => {
    triggerButton = trigger;
    const body = node('div', 'profile-details');
    const header = node('div', 'profile-header');
    header.append(node('p', 'profile-eyebrow', 'LIVE CRAFT / MEMBER PROFILE'));
    const title = node('h2', 'profile-title', member.name);
    title.id = 'profile-dialog-name';
    header.append(title);
    const meta = node('div', 'profile-meta');
    const generationTag = node('span', 'profile-generation');
    generationTag.append(node('span', 'profile-generation-label', '所属期生'));
    generationTag.append(node('strong', '', generationLabel(generationOf(member))));
    meta.append(generationTag);
    if (typeof member.role === 'string' && member.role.trim()) {
      meta.append(node('span', 'profile-role', member.role.trim()));
    }
    header.append(meta);
    body.append(header);

    if (Array.isArray(member.genres)) {
      const tags = node('div', 'member-tags profile-genres');
      member.genres.filter(x => typeof x === 'string' && x.trim()).slice(0, 6).forEach(x => tags.append(node('span', 'member-tag', x)));
      if (tags.childElementCount) body.append(tags);
    }

    const bioSection = node('section', 'profile-section');
    bioSection.append(node('h3', 'profile-section-title', 'ABOUT'));
    bioSection.append(node('p', 'profile-bio', typeof member.bio === 'string' && member.bio.trim() ? member.bio.trim() : 'プロフィールの紹介文は準備中です。'));
    body.append(bioSection);

    const linksSection = node('section', 'profile-section');
    linksSection.append(node('h3', 'profile-section-title', 'ACTIVITY / SNS'));
    const linkList = node('div', 'profile-links');
    if (Array.isArray(member.links)) {
      member.links.slice(0, 10).forEach(link => {
        if (!link || typeof link.label !== 'string' || !link.label.trim()) return;
        const url = safeUrl(link.url);
        if (!url) return;
        const a = node('a', 'profile-link');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', `${member.name}の${link.label}を開く（新しいタブ）`);
        a.append(node('span', 'profile-link-label', link.label));
        a.append(node('span', 'profile-link-arrow', '↗'));
        linkList.append(a);
      });
    }
    if (linkList.childElementCount) linksSection.append(linkList);
    else linksSection.append(node('p', 'profile-link-empty', '活動リンクは準備中です。'));
    body.append(linksSection);

    const layout = node('div', 'profile-layout');
    const side = node('div', 'profile-art');
    side.append(createAvatar(member, 'profile-avatar', true));
    side.append(node('span', 'profile-art-caption', 'STREAMERS COMMUNITY'));
    layout.append(side, body);
    dialogContent.replaceChildren(layout);
    dialog.showModal();
    document.body.classList.add('modal-open');
    closeButton.focus();
  };
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    // Clicks on the native dialog's backdrop (outside its rectangle) close it.
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (triggerButton?.isConnected) triggerButton.focus();
    triggerButton = null;
  });

  const makeIcon = member => {
    const item = node('li', 'member-icon-item');
    const button = node('button', 'member-icon-button');
    button.type = 'button';
    button.setAttribute('aria-label', `${member.name}（${generationLabel(generationOf(member))}）のプロフィールを見る`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.title = `${member.name}のプロフィールを見る`;
    button.append(createAvatar(member, 'member-icon-art'));
    button.append(node('span', 'member-icon-action', '↗'));
    button.addEventListener('click', () => showProfile(member, button));
    item.append(button);
    return item;
  };
  const selectGeneration = value => {
    activeGeneration = value;
    render();
  };

  const makeGenerationControl = (value, label, total) => {
    const button = node('button', 'generation-filter');
    button.type = 'button';
    button.dataset.generation = value;
    button.setAttribute('aria-pressed', String(activeGeneration === value));
    button.append(node('span', 'generation-filter-text', label));
    button.append(node('span', 'generation-filter-count', String(total).padStart(2, '0')));
    button.addEventListener('click', () => selectGeneration(value));
    return button;
  };

  const makeGroup = (generation, collection) => {
    const section = node('section', 'generation-group');
    const header = node('div', 'generation-group-header');
    const heading = node('div', 'generation-group-heading');
    heading.append(node('span', 'generation-group-eyebrow', generation == null ? 'GENERATION / UNASSIGNED' : `GENERATION / ${String(generation).padStart(2, '0')}`));
    heading.append(node('h3', 'generation-group-title', generationLabel(generation)));
    header.append(heading);
    header.append(node('span', 'generation-group-count', `${collection.length} MEMBERS`));
    section.append(header);
    const list = node('ul', 'member-grid');
    list.setAttribute('aria-label', `${generationLabel(generation)}のメンバーアイコン`);
    list.append(...collection.map(makeIcon));
    section.append(list);
    return section;
  };

  const render = () => {
    const genre = filter.value;
    const byGenre = genre === 'all' ? members : members.filter(m => Array.isArray(m.genres) && m.genres.includes(genre));
    const buttons = [makeGenerationControl('all', 'すべて', byGenre.length)];
    generations.forEach(generation => {
      const value = generation == null ? 'unassigned' : String(generation);
      buttons.push(makeGenerationControl(value, generationLabel(generation), byGenre.filter(m => generationOf(m) === generation).length));
    });
    generationFilters.replaceChildren(...buttons);
    const selected = activeGeneration === 'all' ? byGenre : byGenre.filter(m => (generationOf(m) == null ? 'unassigned' : String(generationOf(m))) === activeGeneration);
    const visibleGenerations = activeGeneration === 'all' ? generations : generations.filter(g => (g == null ? 'unassigned' : String(g)) === activeGeneration);
    const groups = visibleGenerations.map(generation => {
      const collection = selected.filter(m => generationOf(m) === generation);
      return collection.length ? makeGroup(generation, collection) : null;
    }).filter(Boolean);
    grid.replaceChildren(...groups);
    grid.hidden = !groups.length;
    resultStatus.textContent = `${selected.length}名を表示中`;
    if (!groups.length) {
      empty.hidden = false;
      empty.querySelector('h3').textContent = '該当するメンバーはいません。';
      empty.querySelector('p').textContent = 'ほかの期生やジャンルを選択してください。';
    } else {
      empty.hidden = true;
    }
  };

  generationToolbar.hidden = false;
  resultStatus.hidden = false;
  filter.addEventListener('change', render);
  render();
})();
