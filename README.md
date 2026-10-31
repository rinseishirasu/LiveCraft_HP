# Live Craft 公式サイト Ver.4.1

**テーマ：ONE COMMUNITY. MANY COLORS.**

GitHub Pagesにそのまま置ける、ビルド不要の静的公式サイトです。デザインはVTuber事務所サイトの「キャラクター・メンバーを主役にした大きな視覚表現」や「期生別で探せる導線」から発想を得ていますが、ブランド・配色・構成はLive Craft独自です。

## Ver.4.1 での主な更新

1. 新しいLive Craftロゴをヘッダー、フッター、トップページ、ファビコン、OG画像に採用
2. HOMEを公式タレントサイトのような大きなビジュアルに刷新。見出し、ロゴポスター、動く装飾、メンバー紹介プレビューを追加
3. MEMBERSを期生色ごとの一覧に改良。アイコン、期生ボタン、グループ背景、詳細ポップアップの色が連動
4. プロフィール詳細に「立ち絵が映える縦長ステージ」を追加。`fullbody` を設定すると画像を表示。未設定ならアイコンの拡大表示に自動切り替え
5. 既存10ページ、NEWS、FAQ検索、CONTACT、募集設定、プライバシー・規約ページを維持
6. PC・スマホ表示に対応し、`prefers-reduced-motion` に配慮

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

## Ver.4.0/旧Ver.4.1からの更新

- 原則すべてのHTMLと `assets` 内のCSS/JS、ブランド画像を置き換えてください。
- **すでに公開中の `assets/members.js`、`assets/members/`、`assets/news.js`、`assets/config.js` は事前にバックアップし、登録済みデータを新しい版へ移してください。** 上書きで消さないよう注意してください。
- 新規ファイル：`assets/v41.css`、`assets/v41.js`、`assets/live-craft-lockup.webp`
- ロゴが更新されない場合は、ブラウザーのキャッシュをクリアして再読み込みしてください。

## 安全な公開のために

配信者の本名、住所、非公開Discord情報、応募者・面談の審査情報等をサイトのコードやリポジトリに保存しないでください。GitHub Pagesで配信されるファイルは公開情報です。立ち絵やイラストには本人および著作権者の利用許諾が必要です。

## サイト構成

- `index.html`：トップ
- `about.html`：コミュニティについて
- `activities.html`：活動内容
- `members.html`：期生別メンバー一覧と立ち絵対応詳細ポップアップ
- `news.html`：お知らせ
- `join.html`：応募・加入について
- `faq.html`：FAQ
- `contact.html`：問い合わせ
- `guidelines.html`：コミュニティ規約
- `privacy.html`：個人情報の取り扱い
- `404.html`：404ページ

制作物はLive Craft用の独自デザインで、特定のVTuber事務所のロゴや公式ビジュアルは含んでいません。
