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
  let searchTerm = '';
  const searchInput = document.getElementById('member-search');

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
  // Optional public profile fields. Nothing is rendered when left blank.
  const clean = value => typeof value === 'string' ? value.trim() : '';
  const publicColor = value => /^#[0-9a-fA-F]{6}$/.test(clean(value)) ? clean(value) : null;
  const birthdayLabel = value => {
    const match = /^(\d{2})-(\d{2})$/.exec(clean(value));
    if (!match) return '';
    const month = Number(match[1]);
    const day = Number(match[2]);
    const check = new Date(Date.UTC(2024, month - 1, day));
    return check.getUTCMonth() + 1 === month && check.getUTCDate() === day ? `${month}月${day}日` : '';
  };
  const debutLabel = value => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean(value));
    if (!match) return '';
    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    const check = new Date(Date.UTC(year, month - 1, day));
    return check.getUTCFullYear() === year && check.getUTCMonth() + 1 === month && check.getUTCDate() === day ? `${year}年${month}月${day}日` : '';
  };
  const visibleText = (value, limit = 240) => clean(value).slice(0, limit);
  const tagText = value => {
    const valueText = visibleText(value, 80).replace(/^＃/, '#').replace(/^#/, '');
    return valueText ? '#' + valueText : '';
  };
  const addSection = (body, title, className = '') => {
    const section = node('section', `profile-section profile-extra-section ${className}`.trim());
    section.append(node('h3', 'profile-section-title', title));
    body.append(section);
    return section;
  };
  const makeExternalLink = (label, url, extraClass = '') => {
    const parsed = safeUrl(url);
    if (!parsed) return null;
    const a = node('a', `profile-link ${extraClass}`.trim());
    a.href = parsed;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.append(node('span', 'profile-link-label', label));
    a.append(node('span', 'profile-link-arrow', '↗'));
    a.setAttribute('aria-label', `${label}（新しいタブ）`);
    return a;
  };


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
    if (publicColor(member.memberColor)) layout.style.setProperty('--member-personal-color', publicColor(member.memberColor));
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
    // The optional member color complements the generation palette, rather than replacing it.
    const personalColor = publicColor(member.memberColor);
    if (personalColor) {
      visualCard.style.setProperty('--member-color', personalColor);
      const colorPill = node('span', 'profile-color-pill');
      colorPill.append(node('span', 'profile-color-dot'));
      colorPill.append(node('span', '', visibleText(member.colorName, 28) || 'MEMBER COLOR'));
      visualCard.append(colorPill);
    }
    side.append(visualCard);

    const body = applyTheme(node('div', 'profile-details'), generationOf(member));
    const header = node('div', 'profile-header');
    header.append(node('p', 'profile-eyebrow', 'LIVE CRAFT / MEMBER PROFILE'));
    if (clean(member.catchphrase)) {
      header.append(node('p', 'profile-catchphrase', visibleText(member.catchphrase, 140)));
    }

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
    // Outside agency affiliation is independent of the role within Live Craft.
    const agency = typeof member.agency === 'string' ? member.agency.trim().slice(0, 80) : '';
    if (agency) {
      const affiliation = node('span', 'profile-agency');
      affiliation.append(node('span', 'profile-agency-label', '所属事務所'));
      affiliation.append(node('strong', 'profile-agency-name', agency));
      meta.append(affiliation);
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

    // BIO / BASIC FACTS
    const facts = [
      ['誕生日', birthdayLabel(member.birthday)],
      ['デビュー日', debutLabel(member.debutDate)],
      ['ファンネーム', visibleText(member.fanName, 50)],
      ['ファンマーク', visibleText(member.fanMark, 32)]
    ].filter(([,value]) => value);
    if (facts.length || personalColor) {
      const section = addSection(body, 'PROFILE / 基本情報');
      const dl = node('dl', 'profile-facts');
      for (const [label, value] of facts) {
        const cell = node('div', 'profile-fact');
        cell.append(node('dt', '', label), node('dd', '', value));
        dl.append(cell);
      }
      if (personalColor) {
        const cell = node('div', 'profile-fact');
        cell.append(node('dt', '', 'メンバーカラー'));
        const dd = node('dd', 'profile-color-value');
        const dot = node('span', 'profile-color-swatch');
        dot.style.backgroundColor = personalColor;
        dot.setAttribute('aria-hidden', 'true');
        dd.append(dot, node('span', '', visibleText(member.colorName, 28) || personalColor));
        cell.append(dd);
        dl.append(cell);
      }
      section.append(dl);
    }

    const tags = [
      ['配信タグ', tagText(member.streamTag)],
      ['ファンアート', tagText(member.fanArtTag)]
    ].filter(([,value]) => value);
    if (tags.length) {
      const section = addSection(body, 'HASHTAGS / ハッシュタグ');
      const list = node('div', 'profile-hashtag-list');
      for (const [label,value] of tags) {
        const chip = node('div', 'profile-hashtag');
        chip.append(node('span', 'profile-hashtag-kind', label), node('strong', 'profile-hashtag-value', value));
        list.append(chip);
      }
      section.append(list);
    }

    const hobbies = Array.isArray(member.hobbies)
      ? member.hobbies.filter(x => clean(x)).slice(0, 12).map(x => visibleText(x, 40))
      : clean(member.hobbies) ? [visibleText(member.hobbies, 200)] : [];
    if (hobbies.length) {
      const section = addSection(body, 'LIKES / 好きなこと・趣味');
      const list = node('div', 'profile-hobbies');
      hobbies.forEach(x => list.append(node('span', 'profile-hobby', x)));
      section.append(list);
    }

    const schedule = visibleText(member.schedule, 600);
    const scheduleLink = makeExternalLink('配信予定を確認する', member.scheduleUrl, 'profile-schedule-link');
    if (schedule || scheduleLink) {
      const section = addSection(body, 'SCHEDULE / 配信スケジュール');
      if (schedule) section.append(node('p', 'profile-schedule', schedule));
      if (scheduleLink) section.append(scheduleLink);
    }

    const videoLink = makeExternalLink('自己紹介動画を見る', member.introVideoUrl, 'profile-video-link');
    if (videoLink) {
      const section = addSection(body, 'MOVIE / 自己紹介動画');
      const frame = node('div', 'profile-video-panel');
      frame.append(node('span', 'profile-video-play', '▶'));
      const textWrap = node('div', 'profile-video-copy');
      textWrap.append(node('strong', '', 'INTRODUCTION MOVIE'), node('span', '', '自己紹介を動画でチェック'));
      frame.append(textWrap, videoLink);
      section.append(frame);
    }

    const illustrator = visibleText(member.illustrator, 100);
    if (illustrator) {
      const section = addSection(body, 'CREDITS / キャラクターデザイン');
      const credit = node('div', 'profile-credits');
      credit.append(node('span', 'profile-credit-caption', 'Illustrator / Designer'));
      const link = makeExternalLink(illustrator, member.illustratorUrl, 'profile-illustrator-link');
      if (link) credit.append(link);
      else credit.append(node('strong', 'profile-credit-name', illustrator));
      section.append(credit);
    }

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
    const actions = node('div', 'lc43-modal-actions');
    const profileLink = node('a', 'lc43-action-main', 'プロフィール専用ページ ↗');
    profileLink.href = window.LiveCraftMembers.urlFor(member);
    actions.append(profileLink);
    const share = node('a', 'lc43-action-share', 'Xで共有 ↗');
    share.href = window.LiveCraftMembers.xShare(member);
    share.target = '_blank'; share.rel = 'noopener noreferrer';
    actions.append(share);
    const copy = node('button', 'lc43-action-copy', 'URLをコピー');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(profileLink.href); copy.textContent='コピーしました'; }
      catch { copy.textContent='URLを選択してコピーしてください'; }
    });
    actions.append(copy);
    body.append(actions);
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
    if (publicColor(member.memberColor)) button.style.setProperty('--member-personal-color', publicColor(member.memberColor));
    button.type = 'button';
    button.setAttribute('aria-label', `${member.name}（${generationLabel(generationOf(member))}）のプロフィールを見る`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.title = `${member.name}のプロフィールを見る`;
    if (typeof member.id === 'string') button.dataset.lc5MemberId = member.id;

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
    // Keep the icon-first layout; show the agency only when explicitly supplied.
    const agency = typeof member.agency === 'string' ? member.agency.trim().slice(0, 80) : '';
    if (agency) {
      const affiliation = node('div', 'member-list-agency');
      affiliation.append(node('span', 'member-list-agency-label', '所属事務所'));
      affiliation.append(node('span', 'member-list-agency-name', agency));
      item.append(affiliation);
    }
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
    const normalized = s => String(s ?? '').normalize('NFKC').toLocaleLowerCase('ja');
    const candidates = members.filter(m => {
      const searchable = [m.name,m.catchphrase,m.bio,m.role,m.agency,m.fanName,
        ...(Array.isArray(m.genres)?m.genres:[]),
        ...(Array.isArray(m.links)?m.links.map(l=>l?.label):[])].join(' ');
      return !searchTerm || normalized(searchable).includes(searchTerm);
    });
    const byGenre = genre === 'all' ? candidates : candidates.filter(m => Array.isArray(m.genres) && m.genres.includes(genre));
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
    document.dispatchEvent(new CustomEvent('lc:streams-updated'));
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
  searchInput?.addEventListener('input', event => {
    searchTerm = String(event.target.value || '').normalize('NFKC').toLocaleLowerCase('ja').trim();
    render();
  });
  render();
})();
