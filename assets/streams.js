/* Live Craft Ver.5.0 / 公開配信予定
 * YouTube/Twitch APIは使いません。実際に放送中かどうかは確認できません。
 * 配信開始・終了の予定日時を日本時間(+09:00)付きISO 8601で登録します。
 * id は重複しない固定の英数字/hyphen、memberId は assets/members.js の id と一致。
 * status は scheduled / cancelled / postponed / ended。scheduled のみ予定時刻から LIVE予定 に自動切替。
 * published:true のデータは公開されます。非公開予定・個人情報をGitHubに書かないでください。
 * サンプル（コメント内につき表示されません）:
 * {published:true,id:'stream-001',memberId:'member-001',title:'週末ゲーム配信',platform:'YouTube',
 *  streamUrl:'https://www.youtube.com/watch?v=...',startAt:'2026-11-01T20:00:00+09:00',
 *  endAt:'2026-11-01T22:00:00+09:00',status:'scheduled',thumbnail:'assets/streams/stream-001.webp'}
 */
window.LIVE_CRAFT_STREAMS = [];
