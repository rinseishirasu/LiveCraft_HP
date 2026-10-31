/* NEWS データ: 公開が確定したお知らせだけを登録してください。
   未掲載なら [] のままでOK。架空の告知や日付を登録しないでください。
   category: "募集" / "活動" / "メンバー" / "お知らせ"
   link は省略可。外部へのリンクは https:// のURLを指定。
   本文はプレーンテキスト（HTML不可）。段落ごとに body 配列の要素へ記入。

   記入例（コメントのため公開されません）:
   {
     published: true,
     date: "2026-11-01",  // 実際の公開日
     category: "募集",
     title: "実際の告知タイトル",
     summary: "一覧に表示する短い概要。",
     body: ["告知の本文1段落。", "告知の本文2段落。"],
     link: "https://example.com"
   }
*/
window.LIVE_CRAFT_NEWS = [];
