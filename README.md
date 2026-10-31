# Live Craft 公式サイト Ver.4.3

**Ver.4.2を引き継いだGitHub Pages対応版。ビルド不要・公開データは未登録です。**

## Ver.4.3 で追加した機能

1. **メンバー個別ページ** `member.html?id=member-id`：ブラウザで直接開ける専用プロフィール。既存の詳細ポップアップの「プロフィール専用ページ」から遷移でき、立ち絵・自己紹介・ファン情報・活動リンクなどVer.4.2の全項目を表示します。
2. **メンバー検索**：`members.html`で活動名・キャッチコピー・自己紹介・ジャンル・役割・活動媒体名を検索。期生フィルター・ジャンルフィルターと併用可能。検索対象は`published: true`の人だけです。
3. **ピックアップメンバー**：トップのメンバーカードに `featured: true` を設定した公開メンバーを優先表示（最大4名）。誰にも付けていない場合は公開メンバーの先頭から最大4名を表示。公開メンバーがゼロなら従来の準備中表示。
4. **共有機能**：詳細ポップアップと個別ページからXにシェア、または個別ページのURLをコピーできます。専用URLはGitHub Pagesの通常リポジトリ配下でも動く相対URLから生成します。
5. **メンバーカラー連動**：本人が`memberColor: "#RRGGBB"`を設定すると、アイコンの差し色や個別ページのトップボーダー・背景グローが変化。期生別カラー・バッジは維持します。

### 追加するメンバーデータ（`assets/members.js`）

```js
window.LIVE_CRAFT_MEMBERS = [
  {
    published: true,           // 本人に掲載同意を確認した場合のみ
    id: "sample-luna",         // 個別URLで使う、永続的なID（推奨）
    featured: true,            // トップのPICK UPで優先表示（任意）
    name: "活動名",
    generation: 1,
    role: "メンバー",
    avatar: "assets/members/icon.webp",
    fullbody: "assets/members/standing.webp",
    genres: ["ゲーム", "雑談"],
    memberColor: "#8265EA",    // 任意・個別テーマのアクセント
    bio: "自己紹介文",
    links: [{ label: "YouTube", url: "https://www.youtube.com/@example" }]
  }
];
```

**IDの決め方**：英小文字・数字・ハイフンで、1〜60文字（先頭は英数字）。例：`yume-01`, `hikari`, `member-003`。人ごとに重複しない固定IDにしてください。一度公開したIDを変更すると、古いプロフィールURLが使えなくなります。`id`を省略した場合は期生と名前からURLが自動生成されますが、改名や期生の修正でリンクが変わるため、正式公開ではID指定を推奨します。

**URLの例**：`https://YOURNAME.github.io/live-craft/member.html?id=sample-luna`。実際のURLはGitHub Pagesの公開先によって変わります。

**共有画像についての制約**：個別プロフィールの表示・共有リンクは機能しますが、`member.html?id=...` は静的HTMLが共通のため、XなどのSNSで共有した際のOGPプレビュー画像は全メンバー共通のLive Craft画像です。個人別OGPが必要な場合は、別途ページ生成の仕組みが必要です。

### Ver.4.2からのアップデート手順

- **必ずバックアップ**：`assets/members.js`、`assets/members/`、`assets/news.js`、`assets/config.js`、および編集した全ファイル。
- Ver.4.3のサイト一式をアップロード後、バックアップした登録済みデータを戻してください。
- 新規ファイル：`member.html`、`assets/member-routing.js`、`assets/profile-ui.js`、`assets/member-detail.js`、`assets/member-search-ui.js`、`assets/v43-home.js`、`assets/v43.css`。
- 更新ファイル：`index.html`、`members.html`、`assets/members-page.js`、`assets/members.js`（記入例のみ）、および各HTMLのCSS参照。
- 他のページ・NEWS・FAQ・募集・規約機能は従来通りです。立ち絵も引き続き任意で、未登録時はアイコンを代替表示します。

**安全性**：公開メンバーデータだけを使用し、未公開データは検索・詳細・トップの表示対象から除外します。個人情報や非公開の審査資料をGitHubリポジトリに保存しないでください。素材の掲載許諾を確認してください。

---

## Ver.4.2以前の基本仕様


**テーマ：ONE COMMUNITY. MANY COLORS.**

GitHub Pagesにそのまま置ける、ビルド不要の静的公式サイトです。デザインはVTuber事務所サイトの「キャラクター・メンバーを主役にした大きな視覚表現」や「期生別で探せる導線」から発想を得ていますが、ブランド・配色・構成はLive Craft独自です。

## Ver.4.1 での主な更新

1. 新しいLive Craftロゴをヘッダー、フッター、トップページ、ファビコン、OG画像に採用
2. HOMEを公式タレントサイトのような大きなビジュアルに刷新。見出し、ロゴポスター、動く装飾、メンバー紹介プレビューを追加
3. MEMBERSを期生色ごとの一覧に改良。アイコン、期生ボタン、グループ背景、詳細ポップアップの色が連動
4. プロフィール詳細に「立ち絵が映える縦長ステージ」を追加。`fullbody` を設定すると画像を表示。未設定ならアイコンの拡大表示に自動切り替え
5. 既存10ページ、NEWS、FAQ検索、CONTACT、募集設定、プライバシー・規約ページを維持
6. PC・スマホ表示に対応し、`prefers-reduced-motion` に配慮

## Ver.4.2 の主な追加機能

メンバーのプロフィール詳細ポップアップを拡張しました。従来の「期生別アイコン一覧」「個人プロフィール」「立ち絵」「ジャンル」「自己紹介」「SNS」「期生カラー」を残し、公開したい情報だけを追加できます。

| 追加項目 | `assets/members.js` のキー | 登録形式 |
|---|---|---|
| キャッチコピー | `catchphrase` | 文字列 |
| 誕生日 | `birthday` | `MM-DD` （**年なし**、例 `04-15`） |
| デビュー日 | `debutDate` | `YYYY-MM-DD` （例 `2026-04-15`） |
| ファンネーム | `fanName` | 文字列 |
| ファンマーク | `fanMark` | 絵文字・文字列 |
| 配信タグ | `streamTag` | `#` 付き文字列（なしでも表示時に追加） |
| ファンアートタグ | `fanArtTag` | `#` 付き文字列 |
| 趣味・好きなこと | `hobbies` | 文字列の配列（例 `["歌","ゲーム"]`） |
| メンバーカラー | `memberColor` | `#RRGGBB` （例 `#8D79EC`） |
| カラー名 | `colorName` | 文字列・任意 |
| 配信スケジュール | `schedule` | 公開用テキスト、改行可 |
| スケジュールリンク | `scheduleUrl` | `https://` から始まるURL |
| 自己紹介動画 | `introVideoUrl` | 動画ページの `https://` URL |
| キャラクターデザイナー | `illustrator` | 活動名・クレジット表記 |
| 制作者リンク | `illustratorUrl` | `https://` URL |

- **すべて任意**。項目が未入力なら、そのセクションは表示されません。
- プロフィールに「ABOUT」「基本情報」「ハッシュタグ」「趣味」「配信予定」「自己紹介動画」「制作クレジット」「活動リンク」が自動的に組み立てられます。
- メンバーカラーは本人用の色として表示し、**期生別のカラーはそのまま維持**します。
- 動画は自動再生・埋め込みをせず、クリックで外部ページを開く構成です。
- 生年月日（年付き）、年齢、本名、住所、個人の非公開予定は登録しないでください。
- 応募フォーム・NEWS・その他のページへの変更はありません。

### Ver.4.2 データ登録例

```js
window.LIVE_CRAFT_MEMBERS = [
  {
    published: true,
    name: "活動名",
    generation: 1,
    role: "メンバー",
    avatar: "assets/members/icon.webp",
    fullbody: "assets/members/fullbody.webp",
    genres: ["ゲーム", "雑談"],
    bio: "配信への思いを紹介します。",
    catchphrase: "毎日を、少し面白く。",
    birthday: "04-15",
    debutDate: "2026-04-15",
    fanName: "クラフトメイト",
    fanMark: "🎮✨",
    streamTag: "#ライブ配信",
    fanArtTag: "#ライブFA",
    hobbies: ["ゲーム", "イラスト"],
    memberColor: "#8D79EC",
    colorName: "ラベンダー",
    schedule: "配信予定はSNSでお知らせします。",
    scheduleUrl: "https://example.com/schedule",
    introVideoUrl: "https://www.youtube.com/watch?v=EXAMPLE",
    illustrator: "イラストレーター名",
    illustratorUrl: "https://example.com/creator",
    links: [
      { label: "YouTube", url: "https://www.youtube.com/@example" },
      { label: "X", url: "https://x.com/example" }
    ]
  }
];
```

記入例のURLはダミーです。実際に公開する際は本人から許可を得たURLと素材に差し替えてください。

## 公開方法

1. ZIPを解凍し、**中身**の `index.html`、`members.html`、`assets/` などをGitHubリポジトリのルートにアップロードします。
2. GitHubの **Settings → Pages** で **Deploy from a branch** を選び、`main` / `(root)` を指定してください。
3. リポジトリが `USERNAME.github.io` なら `https://USERNAME.github.io/`、通常のリポジトリなら `https://USERNAME.github.io/REPOSITORY/` が基本URLです。
4. 相対パス指定のため、通常のProject Pagesにも対応します。

※ GitHubへのアップロード・デプロイは自動実行していません。

## 公開前に必要な設定

`assets/config.js` に以下を設定してください。

- `recruitmentOpen`: メンバー募集の公開状態
- `applicationUrl`: 外部応募フォームの回答者用URL
- `contactUrl`: 外部問い合わせフォームのURL
- `rulesEffectiveDate`: 規約の施行日

初期状態は募集準備中・問い合わせ準備中で、架空のメンバーや記事は含まれていません。

NEWSは `assets/news.js`、メンバーは `assets/members.js` で編集します。

## メンバーデータの追加方法

`assets/members.js` の配列 `window.LIVE_CRAFT_MEMBERS` に、**本人の掲載同意を得た公開情報だけ**を追加します。

```js
window.LIVE_CRAFT_MEMBERS = [
  {
    published: true,
    name: "活動名",
    generation: 1,
    role: "メンバー",
    genres: ["ゲーム", "雑談"],
    bio: "公開用自己紹介文",
    avatar: "assets/members/icon-01.webp",     // アイコン（正方形）
    fullbody: "assets/members/fullbody-01.webp", // 立ち絵（任意・縦長）
    links: [
      { label: "YouTube", url: "https://www.youtube.com/@example" },
      { label: "X", url: "https://x.com/example" }
    ]
  }
];
```

- `published`: 本人の公開同意がある場合のみ `true`
- `generation`: 1期生=`1`、2期生=`2`、3期生=`3`。未指定の場合は「期生未設定」になります。
- `avatar`: 正方形画像。推奨512×512px程度、PNG/WebP/JPEG/AVIF対応
- `fullbody`: 立ち絵。推奨 **透過PNGまたは透過WebP、縦長（例：900×1600px）**。未設定・読込エラー時はアイコンの拡大表示になります。
- 画像は `assets/members/` に配置し、英数字・ハイフン等の安全なファイル名を使ってください。
- 活動リンクは `https://` のみ表示します。

### 期生のテーマカラー

| 期生 | カラー | カラーコード |
|---|---|---|
| 1期生 | ラベンダー | `#7456E8` |
| 2期生 | ミント | `#13A8A2` |
| 3期生 | ピンク | `#F06A92` |
| 4期生 | ハニー | `#E4A52C` |
| 5期生 | ブルー | `#4C89E7` |
| 6期生 | オーキッド | `#A96BE4` |
| 7期生 | グリーン | `#43A76A` |

8期生以降は7色が循環します。配色を増やしたい場合は `assets/members-page.js` の `generationPalette` 配列を変更してください。期生番号は常に文字でも表示されます。

## Ver.4.1からVer.4.2への更新

- 既にVer.4.1を公開済みの場合は、主に `members.html`、`assets/members-page.js` を更新し、新しい `assets/v42.css` を追加してください。
- **すでに公開中の `assets/members.js`、`assets/members/`、`assets/news.js`、`assets/config.js` は事前にバックアップし、登録済みデータを新しい版へ移してください。** 上書きで消さないよう注意してください。
- 新規ファイル：`assets/v42.css`（既存の `v41.css` も必要）。
- ロゴが更新されない場合は、ブラウザーのキャッシュをクリアして再読み込みしてください。

## 安全な公開のために

配信者の本名、住所、非公開Discord情報、応募者・面談の審査情報等をサイトのコードやリポジトリに保存しないでください。GitHub Pagesで配信されるファイルは公開情報です。立ち絵やイラストには本人および著作権者の利用許諾が必要です。

## サイト構成

- `index.html`：トップ
- `about.html`：コミュニティについて
- `activities.html`：活動内容
- `members.html`：期生別一覧と多項目プロフィール・立ち絵対応詳細ポップアップ
- `news.html`：お知らせ
- `join.html`：応募・加入について
- `faq.html`：FAQ
- `contact.html`：問い合わせ
- `guidelines.html`：コミュニティ規約
- `privacy.html`：個人情報の取り扱い
- `404.html`：404ページ

制作物はLive Craft用の独自デザインで、特定のVTuber事務所のロゴや公式ビジュアルは含んでいません。
