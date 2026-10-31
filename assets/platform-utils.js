/* Live Craft Ver.5.0.4: public primary streaming platform metadata.
   The platform is explicitly declared by each member, never inferred from all SNS links. */
(() => {
  'use strict';
  const presets = [
    ['YouTube', ['youtube', 'youtube live', 'yt']],
    ['Twitch', ['twitch']],
    ['TikTok LIVE', ['tiktok', 'tiktok live', 'tik tok live']],
    ['ツイキャス', ['ツイキャス', 'twitcasting']],
    ['IRIAM', ['iriam']],
    ['REALITY', ['reality']],
    ['Mirrativ', ['mirrativ']],
    ['ニコニコ生放送', ['ニコ生', 'ニコニコ生放送', 'niconico']],
    ['SHOWROOM', ['showroom']]
  ];
  const trim = value => typeof value === 'string' ? value.trim().slice(0, 48) : '';
  const key = value => trim(value).normalize('NFKC').toLocaleLowerCase('ja').replace(/\s+/g, ' ');
  const canonical = value => {
    const raw = trim(value);
    if (!raw) return '';
    const normalized = key(raw);
    for (const [name, aliases] of presets) {
      if (key(name) === normalized || aliases.some(a => key(a) === normalized)) return name;
    }
    return raw;
  };
  const primary = member => member && typeof member === 'object' ? canonical(member.primaryPlatform) : '';
  const safeUrl = value => {
    if (typeof value !== 'string') return null;
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
    catch { return null; }
  };
  const mainUrl = member => {
    if (!primary(member)) return null;
    const explicit = safeUrl(member.primaryPlatformUrl);
    if (explicit) return explicit;
    // Only an explicitly matching public link can supply a fallback URL.
    const match = Array.isArray(member.links) ? member.links.find(link => link && canonical(link.label) === primary(member) && safeUrl(link.url)) : null;
    return match ? safeUrl(match.url) : null;
  };
  const options = members => [...new Set((Array.isArray(members) ? members : []).map(primary).filter(Boolean))]
    .sort((a,b) => a.localeCompare(b, 'ja'));
  const matches = (member, selected) => selected === 'all' || primary(member) === selected;
  window.LiveCraftPlatforms = Object.freeze({canonical, primary, mainUrl, options, matches, presets: presets.map(p=>p[0])});
})();
