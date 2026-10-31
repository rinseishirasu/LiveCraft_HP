/* Live Craft メンバー公開用データ (Ver.3.1)
 * 本人が公開に同意したプロフィール「のみ」を記載してください。
 * 公開ファイルは誰でも閲覧でき、Gitの履歴にも残る場合があります。
 * 本名、誕生日、住所、非公開Discord、審査情報などは書かないでください。
 *
 * generation: 1 のように「期生」を整数で記載してください。
 * 1 → 1期生、2 → 2期生。新しい期生は番号を登録するだけで自動追加されます。
 * generation未設定の旧データは「期生未設定」に分けて表示されます。
 *
 * データ例 (コメント内なのでサイト上には掲載されません):
 * {
 *   published: true,             // 本人の公開同意後に限る
 *   name: "活動名",
 *   generation: 1,               // 1期生。2期生なら 2
 *   role: "メンバー",             // 代表 / 運営 / メンバー、省略可
 *   genres: ["ゲーム", "雑談"],
 *   bio: "配信活動や自己紹介を記入してください。",
 *   avatar: "assets/members/profile-01.webp",
 *   links: [
 *     {label: "YouTube", url: "https://www.youtube.com/@your-channel"},
 *     {label: "X", url: "https://x.com/your-account"}
 *   ]
 * }
 */
window.LIVE_CRAFT_MEMBERS = [];
