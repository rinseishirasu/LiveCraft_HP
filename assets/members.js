/* Live Craft メンバー公開用データ
 * 掲載への本人の同意を得てから、公開してよい情報のみ追加してください。
 * GitHub Pagesの配信ファイルなので、この内容は全世界に公開されます。
 * published: true のプロフィールだけが公開ページに表示されます。
 * 本名、生年月日、住所、私用Discord、審査情報などは絶対に入れないでください。
 * 一覧ではアイコンだけが表示され、クリックすると name / role / genres / bio / links が表示されます。
 *
 * 追加例（以下はコメントであり、実在メンバーではありません）:
 * {
 *   published: true, // 必ず本人から掲載同意を得たあと設定
 *   name: "活動名を記入",
 *   role: "メンバー", // 代表 / 運営 / メンバー、空欄も可
 *   genres: ["ゲーム", "雑談"],
 *   bio: "プロフィールを開いたときに表示する紹介文。本人と内容を確認してください。",
 *   avatar: "assets/members/profile-01.webp", // 一覧アイコンと詳細画面に表示。未指定なら頭文字
 *   links: [
 *     { label: "YouTube", url: "https://www.youtube.com/@your-channel" },
 *     { label: "X", url: "https://x.com/your-account" }
 *   ]
 * }
 */
window.LIVE_CRAFT_MEMBERS = [];
