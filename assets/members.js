/* Live Craft Ver.4.3 | 公開用メンバープロフィール
 * 下記は記入例です。コメント内のためサイトには公開されません。
 * メンバーの同意がある公開情報のみ登録してください。
 * 生年、本名、住所、非公開Discord、応募審査情報、個人の予定等は記載しないこと。
 * GitHub Pages のJSは誰でも閲覧でき、Git履歴にも残り得ます。
 *
 * フィールド                        形式・意味
 * id: "your-name"                 公開URL用の固定ID（英小文字・数字・ハイフン）
 * featured: true                   HOMEで優先表示したい場合のみ。任意
 * published: true                  掲載同意済みの場合のみ true
 * name: "活動名"                    必須
 * generation: 1                    所属期生（1, 2, 3...）
 * role: "メンバー"                  代表 / 運営 / メンバー等
 * avatar: "assets/members/..."    一覧アイコン：正方形画像
 * fullbody: "assets/members/..."  任意・詳細立ち絵：縦長透過PNG/WebP推奨
 * genres: ["ゲーム", "雑談"]       ジャンル：最大6個表示
 * bio: "自由な自己紹介"              自己紹介
 * catchphrase: "自分らしい一言"     キャッチコピー
 * birthday: "04-15"               誕生日（月日限定 MM-DD／年は書かない）
 * debutDate: "2026-04-15"          デビュー日（YYYY-MM-DD）
 * fanName: "ファンネーム"           任意
 * fanMark: "🫧🎮"                  任意・絵文字
 * streamTag: "#配信タグ"           配信ハッシュタグ
 * fanArtTag: "#ファンアートタグ"   ファンアートタグ
 * hobbies: ["ゲーム", "お絵描き"]   好きなこと・趣味
 * memberColor: "#8D79EC"          個人カラー（#RRGGBB。期生カラーは維持）
 * colorName: "すみれ色"            個人カラーの名前（任意）
 * schedule: "配信は主に夜。不定期"  活動予定についての公開案内（任意）
 * scheduleUrl: "https://..."      公開スケジュールへのリンク
 * introVideoUrl: "https://..."    自己紹介動画（外部リンク）
 * illustrator: "制作者のお名前"     キャラクターデザイナー／立ち絵制作者
 * illustratorUrl: "https://..."  制作者の公開ページ
 * links: [                          活動媒体・SNS。最大10リンク
 *   { label: "YouTube", url: "https://www.youtube.com/@example" },
 *   { label: "X", url: "https://x.com/example" }
 * ]
 *
 * 任意項目が空なら、その情報欄は表示されません。
 * 画像はassets/members/に保存し、英数字等のファイル名を使ってください。
 * 動画・SNS・スケジュール・制作者リンクは https:// URL のみ表示。
 *
 * 登録例（コメントを外して配列に追加すること）：
 * {
 *   id: "sample-streamer",
 *   featured: true,
 *   published: true,
 *   name: "サンプル配信者",
 *   generation: 1,
 *   role: "メンバー",
 *   genres: ["ゲーム", "雑談"],
 *   bio: "自分らしい配信を目指しています。",
 *   catchphrase: "好奇心が配信のエンジン。",
 *   birthday: "04-15",
 *   debutDate: "2026-04-15",
 *   fanName: "クラフトメイト",
 *   fanMark: "🎮✨",
 *   streamTag: "#サンプル配信",
 *   fanArtTag: "#サンプルFA",
 *   hobbies: ["ゲーム", "デザイン"],
 *   memberColor: "#8D79EC",
 *   colorName: "ラベンダー",
 *   schedule: "配信予定はSNSでお知らせします。",
 *   scheduleUrl: "https://example.com/schedule",
 *   introVideoUrl: "https://www.youtube.com/watch?v=EXAMPLE",
 *   illustrator: "イラストレーター名",
 *   illustratorUrl: "https://example.com/creator",
 *   avatar: "assets/members/example-icon.webp",
 *   fullbody: "assets/members/example-fullbody.webp",
 *   links: [{ label: "YouTube", url: "https://www.youtube.com/@example" }]
 * }
 */
window.LIVE_CRAFT_MEMBERS = [];
