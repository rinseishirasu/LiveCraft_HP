/* Live Craft Ver.7.0.5 | Shared, fixed generation color presets (0–10).
 * These are presentation colors, not a substitute for generation labels.
 * No member data is stored in this file.
 */
(() => {
  'use strict';
  const presets = Object.freeze([
    Object.freeze({generation:0,name:'グラファイト',english:'Graphite',accent:'#566579',soft:'#EDF0F5',dark:'#38465C'}),
    Object.freeze({generation:1,name:'ラベンダー',english:'Lavender',accent:'#7456E8',soft:'#EDE8FF',dark:'#5944B9'}),
    Object.freeze({generation:2,name:'ミント',english:'Mint',accent:'#13A8A2',soft:'#DDF9F4',dark:'#087F86'}),
    Object.freeze({generation:3,name:'ローズ',english:'Rose',accent:'#F06A92',soft:'#FFE7EF',dark:'#BC3C6A'}),
    Object.freeze({generation:4,name:'ハニー',english:'Honey',accent:'#E4A52C',soft:'#FFF3CF',dark:'#946415'}),
    Object.freeze({generation:5,name:'ブルー',english:'Blue',accent:'#4C89E7',soft:'#E5F0FF',dark:'#3262C0'}),
    Object.freeze({generation:6,name:'オーキッド',english:'Orchid',accent:'#A96BE4',soft:'#F3E8FF',dark:'#7E46B9'}),
    Object.freeze({generation:7,name:'グリーン',english:'Green',accent:'#43A76A',soft:'#E3F7E9',dark:'#288451'}),
    Object.freeze({generation:8,name:'テラコッタ',english:'Terracotta',accent:'#E2784B',soft:'#FFF0E7',dark:'#AE4E29'}),
    Object.freeze({generation:9,name:'インディゴ',english:'Indigo',accent:'#576DB8',soft:'#EAEFFD',dark:'#354280'}),
    Object.freeze({generation:10,name:'ワインレッド',english:'Wine Red',accent:'#BA5A75',soft:'#FBE9EE',dark:'#913B53'})
  ]);
  const unassigned = Object.freeze({generation:null,name:'期生未設定',english:'Unassigned',accent:'#7A7C9C',soft:'#F1F2F8',dark:'#545572'});
  const generationOf = member => Number.isSafeInteger(member?.generation) && member.generation >= 0 && member.generation <= 999 ? member.generation : null;
  const presetFor = generation => Number.isSafeInteger(generation) && generation >= 0 && generation <= 10 ? presets[generation] : null;
  const themeFor = generation => {const p=presetFor(generation)||unassigned;return [p.accent,p.soft,p.dark];};
  const accentFor = generation => (presetFor(generation)||unassigned).accent;
  const labelFor = generation => generation === null || generation === undefined ? '期生未設定' : `${generation}期生`;
  window.LiveCraftGenerationColors = Object.freeze({presets,unassigned,generationOf,presetFor,themeFor,accentFor,labelFor});
})();
