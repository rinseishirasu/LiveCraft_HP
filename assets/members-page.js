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

  const generationOf = member => Number.isSafeInteger(member.generation) && member.generation > 0 && member.generation <= 999 ? member.generation : null;
  const generationLabel = generation => generation == null ? '期生未設定' : `${generation}期生`;
  // 期生ごとの独自カラー。8期生以降も順番にテーマが巡回します。
  const generationPalette = [
    ['#7456E8','#EDE8FF','#5944B9'], // 1期生: lavender
    ['#13A8A2','#DDF9F4','#087F86'], // 2期生: mint
    ['#F06A92','#FFE7EF','#C94879'], // 3期生: pink
    ['#E4A52C','#FFF3CF','#A8741C'], // 4期生: honey
    ['#4C89E7','#E5F0FF','#3262C0'], // 5期生: blue
    ['#A96BE4','#F3E8FF','#7E46B9'], // 6期生: orchid
    ['#43A76A','#E3F7E9','#288451']  // 7期生: green
  ];
  const themeFor = generation => generation == null ? ['#7A7C9C','#F1F2F8','#545572'] : generationPalette[(generation - 1) % generationPalette.length];
  const applyTheme = (element, generation) => {
    const [accent, soft, deep] = themeFor(generation);
    element.style.setProperty('--gen-accent', accent);
    element.style.setProperty('--gen-soft', soft);
    element.style.setProperty('--gen-dark', deep);
    element.dataset.generation = generation == null ? 'unassigned' : String(generation);
    return element;
  };
  const generationChip = generation => generation == null ? 'GEN ?' : `GEN ${String(generation).padStart(2, '0')}`;
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
    } catch {
      return null;
    }
  };
  const fullbodyPath = path => typeof path === 'string' && /^assets\/members\/[a-zA-Z0-9_.-]+\.(png|jpg|jpeg|webp|avif)$/.test(path) ? path : null;
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
    const fallback = () => {
      const badge = node('span', 'member-initial member-initial-vt');
      badge.append(node('span', 'member-initial-mark', 'LC'));
      badge.append(node('span', 'member-initial-name', initials(member.name)));
      wrap.replaceChildren(badge);
    };
    const src = avatarPath(member.avatar);
    if (!src) {
      fallback();
    } else {
      const img = node('img');
      img.src = src;
      img.alt = '';
      img.width = eager ? 320 : 220;
      img.height = eager ? 320 : 220;
      img.decoding = 'async';
      img.loading = eager ? 'eager' : 'lazy';
      img.addEventListener('error', fallback, { once: true });
      wrap.append(img);
    }
    return wrap;
  };

  let triggerButton = null;
  const showProfile = (member, trigger) => {
    triggerButton = trigger;
    const layout = node('div', 'profile-layout');
    const side = node('div', 'profile-art');
    const visualCard = applyTheme(node('div', 'profile-visual-card'), generationOf(member));
    visualCard.append(node('span', 'profile-visual-kicker', `GENERATION ${generationOf(member) == null ? '—' : String(generationOf(member)).padStart(2,'0')}`));
    visualCard.append(node('span', 'profile-visual-orbit', '✦'));
    const stage = node('div', 'profile-character-stage');
    const fullbody = fullbodyPath(member.fullbody);
    if (fullbody) {
      const figure = node('img', 'profile-fullbody-image');
      figure.src = fullbody;
      figure.alt = `${member.name}の立ち絵`;
      figure.loading = 'eager';
      figure.decoding = 'async';
      const portrait = createAvatar(member, 'profile-avatar profile-portrait-fallback', true);
      portrait.hidden = true;
      figure.addEventListener('error', () => { figure.hidden = true; portrait.hidden = false; }, {once:true});
      stage.append(figure, portrait);
    } else {
      const portrait = createAvatar(member, 'profile-avatar profile-stage-portrait', true);
      stage.append(portrait, node('span', 'profile-stage-hint', 'PROFILE VISUAL'));
    }
    visualCard.append(stage);
    if (typeof member.role === 'string' && member.role.trim()) {
      visualCard.append(node('span', 'profile-visual-role', member.role.trim()));
    }
    visualCard.append(node('span', 'profile-art-caption', 'LIVE CRAFT / MEMBER'));
    side.append(visualCard);

    const body = applyTheme(node('div', 'profile-details'), generationOf(member));
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

    layout.append(side, body);
    dialogContent.replaceChildren(layout);
    dialog.showModal();
    document.body.classList.add('modal-open');
    closeButton.focus();
  };

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (triggerButton?.isConnected) triggerButton.focus();
    triggerButton = null;
  });

  const makeIcon = member => {
    const item = applyTheme(node('li', 'member-icon-item'), generationOf(member));
    const button = applyTheme(node('button', 'member-icon-button'), generationOf(member));
    button.type = 'button';
    button.setAttribute('aria-label', `${member.name}（${generationLabel(generationOf(member))}）のプロフィールを見る`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.title = `${member.name}のプロフィールを見る`;

    const chip = node('span', 'member-icon-chip', generationChip(generationOf(member)));
    const inner = node('span', 'member-icon-shell');
    inner.append(node('span', 'member-icon-shine'));
    inner.append(createAvatar(member, 'member-icon-art'));
    inner.append(node('span', 'member-icon-foot', 'PROFILE'));
    if (typeof member.role === 'string' && member.role.trim()) {
      inner.append(node('span', 'member-icon-role', member.role.trim()));
    }
    button.append(chip, inner, node('span', 'member-icon-action', '↗'));
    button.addEventListener('click', () => showProfile(member, button));
    item.append(button);
    return item;
  };

  const selectGeneration = value => {
    activeGeneration = value;
    render();
  };

  const makeGenerationControl = (value, label, total) => {
    const button = applyTheme(node('button', 'generation-filter'), value === 'all' ? null : value === 'unassigned' ? null : Number(value));
    button.type = 'button';
    button.dataset.generation = value;
    button.setAttribute('aria-pressed', String(activeGeneration === value));
    button.append(node('span', 'generation-filter-text', label));
    button.append(node('span', 'generation-filter-count', String(total).padStart(2, '0')));
    button.addEventListener('click', () => selectGeneration(value));
    return button;
  };

  const makeGroup = (generation, collection) => {
    const section = applyTheme(node('section', 'generation-group'), generation);
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
