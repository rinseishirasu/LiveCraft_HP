/* Run with node tests/streams.test.cjs, no API calls or external dependencies. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/stream-engine.js'),'utf8');
const context={
  Date,Intl,URL,Set,Map,RegExp,Number,Array,Object,CustomEvent:class{},
  setInterval(){},document:{addEventListener(){},dispatchEvent(){}},
  window:{LIVE_CRAFT_MEMBERS:[{id:'public',name:'Member',published:true},{id:'private',name:'Hidden',published:false}],LIVE_CRAFT_STREAMS:[
    {id:'st1',memberId:'public',title:'Example',published:true,startAt:'2026-11-01T23:30:00+09:00',endAt:'2026-11-02T01:00:00+09:00',status:'scheduled'},
    {id:'st2',memberId:'public',title:'Cancelled',published:true,startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T21:00:00+09:00',status:'cancelled'},
    {id:'st3',memberId:'private',title:'Hidden member',published:true,startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T21:00:00+09:00',status:'scheduled'},
    {id:'st4',memberId:'public',title:'Hidden stream',published:false,startAt:'2026-11-01T20:00:00+09:00',endAt:'2026-11-01T21:00:00+09:00',status:'scheduled'}
  ]}
};
vm.createContext(context);vm.runInContext(source,context);
const S=context.window.LCStream;
assert.equal(S.plans.length,2,'Only public members and published streams');
const ms=x=>Date.parse(x);
const start='2026-11-01T23:30:00+09:00';
assert.equal(S.stateAt(S.plans[1],ms(start)-1800001),'upcoming');
assert.equal(S.stateAt(S.plans[1],ms(start)-1800000),'soon');
assert.equal(S.stateAt(S.plans[1],ms(start)),'scheduled-live');
assert.equal(S.stateAt(S.plans[1],ms('2026-11-02T01:00:00+09:00')),'finished');
assert.equal(S.stateAt(S.plans[0],ms('2026-11-01T20:20:00+09:00')),'cancelled');
assert.equal(S.dayKey(ms('2026-11-01T23:30:00+09:00')),'2026-11-01');
assert.equal(S.startOfWeek(ms('2026-11-01T10:00:00+09:00')),'2026-10-26');
assert.equal(S.addDays('2026-10-31',1),'2026-11-01');
assert.equal(Number.isNaN(S.parseJST('2026-02-30T12:00:00+09:00')),true,'Reject invalid dates');
assert.equal(Number.isNaN(S.parseJST('2026-11-01T23:00:00')),true,'Require explicit JST offset');
console.log('Ver.5.0 stream schedule tests passed.');
