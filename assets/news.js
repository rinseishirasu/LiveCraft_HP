/* NEWS データ: 公開が確定したお知らせだけを登録してください。
   未掲載なら [] のままでOK。架空の告知や日付を登録しないでください。
   category: "募集" / "活動" / "メンバー" / "お知らせ"
   link は省略可。外部へのリンクは https:// のURLを指定。
   本文はプレーンテキスト（HTML不可）。段落ごとに body 配列の要素へ記入。

   記入例（コメントのため公開されません）:
   {
     published: true,
     id: "news-001",       // 固定ID。個別URLで使います
     thumbnail: "assets/news/news-001.webp", // 任意
     date: "2026-11-01",  // 実際の公開日
     category: "募集",
     title: "実際の告知タイトル",
     summary: "一覧に表示する短い概要。",
     body: ["告知の本文1段落。", "告知の本文2段落。"],
     link: "https://example.com",
     publishAt: "2026-11-01T10:00:00+09:00" // 任意：画面表示の開始時刻のみ制御。情報は公開ソースから閲覧可能
   }
*/
window.LIVE_CRAFT_NEWS = [];
