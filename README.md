# Live Craft 公式サイト Ver.5.0.1（品質・全ページ統一アップデート）

このバージョンはVer.5.0の修正版です。**配信予定の時刻判定方式・GitHub Pages対応・既存10+のページとメンバー情報の入力形式は維持**しています。

## 主な修正

- 全17ページ（通常16ページ＋404）の共通ヘッダー・フッターを統一。404・NEWS記事詳細にもSCHEDULEや動画・イベントなどへの導線を追加。
- 404ページにVer.5.0スタイル、言語切り替え、ナビゲーションを適用。
- STREAM SCHEDULEページの旧 `EVENTS` OGPタイトル・説明文を修正。
- HOME / ABOUT / ACTIVITIES / MEMBERS / JOIN US / FAQ / NEWS / EVENTS / VIDEOS / COLLABS / CONTACT / SCHEDULE / 404等の**既定UI文言**をJP/ENで切り替え可能に。ページタイトル・ページ説明も画面上の切り替えに連動。
- 規約・プライバシーは**日本語が正式版**。英語表示ではその旨を明示し、本文は翻訳せず保持。
- 公開イベントカレンダーの月・曜日表示、FAQ検索件数なども日英表示に対応。
- ヘッダーからの画面遷移、既存リンク、スケジュール・メンバー情報との互換性を維持。

### 更新方法

フルZIPの場合、展開後の `live-craft-v5.0.1` **フォルダーの中身**をリポジトリのルートへ配置してください。`Settings > Pages` でGitHub Actionsを利用している場合は既存ワークフローを維持してください。

Ver.5.0から更新する場合は**更新パッチ**の利用を推奨します。新しいスタイルと翻訳用のJS、変更されたHTML・JS・READMEのみが入っています。**`assets/members.js`、`assets/news.js`、`assets/streams.js`、`assets/config.js` など既存の公開データファイルはパッチに含めません。**

サイトのページは公開資料です。未発表情報、応募者情報、各種秘密情報を公開GitHubリポジトリに置かないでください。

### 言語の仕様と制約

- JP/ENは画面上の表示切替です。英語の静的URLを別途生成する構成ではありません。
- 日本語のコミュニティ規約とプライバシー文書は正式な日本語のみを掲載します。日本語文書の正確な英訳は本版に含みません。
- メンバーが個別に登録した活動名、自己紹介、配信タイトル、投稿本文などの**ユーザー作成コンテンツは自動翻訳しません**。英語版を別途登録する仕様は今後の拡張です。
- 検索エンジン・SNSが取得する静的HTMLのメタデータは原則日本語です。EN切替中のブラウザーではタイトル等が切り替わりますが、言語別SEO用の別URL／hreflangは未導入です。
- GitHub Pagesへのデプロイはこのパッケージでは未実行です。公開前にURL・フォーム設定などを確認してください。

### 検証

- 17ページ×PC(1440px)/スマホ(390px)のブラウザー読み込みテスト（JS/CSS直接読込方式）で、JP/ENの切替、横幅の収まり、共通フッターを確認。
- 全ローカルHTMLリンク・JS・CSS参照をチェック。リンク切れなし。
- JavaScript構文とサイト生成スクリプトの実行を確認。LIVE表示は以前の時刻判定機能を維持。
- **制限**：実行環境がローカルHTTPアクセスを遮断するため、通常のURLで開いた状態のブラウザー検証は完了していません。GitHub Pagesへのデプロイ後の最終確認が必要です。

---

# Live Craft 公式サイト Ver.5.0

**Ver.4.5の全機能を引き継ぎ、APIを使わない配信予定連動機能を追加しました。** 公式サイトはGitHub Pagesで公開できます。現在の配信状況は**予定時刻を使った表示**であり、実際の配信開始・終了は確認しません。

## Ver.5.0 の機能

- 新ページ `schedule.html`：日本時間(JST)の週次スケジュール、前週/翌週/今週の切り替え、メンバーによる絞り込み。
- HOME：登録した配信開始・終了の予定時刻内は `LIVE予定` を優先表示。該当がなければ直近の予定を表示。
- MEMBERS：予定時刻内の配信を持つメンバーのアイコンに `LIVE予定` バッジ。
- メンバー専用ページ：その人の予定情報を表示。立ち絵・既存プロフィールは引き継ぎ。
- 開始30分前は「まもなく」、開始から終了予定までは「LIVE予定」、予定終了で表示が変化。手動の `cancelled` / `postponed` / `ended` はLIVE扱いしません。
- ページを開いている間は約30秒ごと、タブ復帰時にも表示を更新。
- `tools/stream-manager.html`：公開配信予定の登録・更新・中止・手動終了と、`streams.js`の書き出し。**GitHubへの直接書込みはしません**。
- 日本語/英語切り替え：**共通ナビゲーション、見出し、HOMEの中心コピー、配信スケジュール画面と配信カード**に対応。規約・プライバシー・一部既存説明文は日本語原文を維持しており、正式な英訳は今後の作業です。規約の日本語版が正式です。
- YouTube/Twitch API・認証情報・外部サーバーは不要です。

### 1. メンバーの登録

先に `assets/members.js` に公開同意のあるメンバーを登録し、`id` を固定します。配信予定の `memberId` はこのIDを参照します。公開プロフィールに掲載許可のない配信予定を登録しないでください。

### 2. 配信予定の登録

`tools/stream-manager.html` をブラウザーで開き、予定を登録して **streams.js を書き出す** ボタンを押してください。出力された `streams.js` で `assets/streams.js` を置き換えてGitHubに反映します。画像は `assets/streams/` に置きます。時刻は必ず `+09:00` 付きISO文字列にしてください。翌日までの配信は終了日時に翌日を入力できます（最長24時間）。

```js
window.LIVE_CRAFT_STREAMS = [
  {
    published: true,
    id: "example-stream-001",
    memberId: "example-member-001", // assets/members.js の固定ID
    title: "公開済みの配信タイトル",
    description: "紹介文（任意）",
    platform: "YouTube",
    streamUrl: "https://www.youtube.com/watch?v=...",
    startAt: "2026-11-01T20:00:00+09:00",
    endAt: "2026-11-01T22:00:00+09:00",
    status: "scheduled", // scheduled | cancelled | postponed | ended
    thumbnail: "assets/streams/stream-001.webp"
  }
];
```

これは記入例です。配布ファイルの `LIVE_CRAFT_STREAMS` は **空** であり、実在しない予定は公開していません。

### 3. 公開状態の判定

- `scheduled`：開始30分前まで「配信予定」、開始30分前から「まもなく」、開始〜終了予定時刻は「LIVE予定」、終了後は「終了予定」。
- `cancelled`：中止の予定として表示（LIVEにはしない）。
- `postponed`：延期の予定として表示（LIVEにはしない）。日時を決め直したら `startAt/endAt` を修正して `scheduled` に戻します。
- `ended`：早期終了時など運営が手動で終了扱いにするための状態。

この切り替えはブラウザーの時計を使用します。時計が誤っている場合、利用者の表示がずれる可能性があります。配信が予定より延びた場合は登録済み終了日時を変更してください。GitHub PagesはHTML・CSS・JSを公開するのみで、実際の配信状況の真偽を判定しません。

### 4. GitHub Pagesへのデプロイ

Ver.4.5からのGitHub Actionsの公開ワークフローを維持しています。`.github/workflows/pages.yml` はmainへのpush・手動実行時にサイトを生成します。**配信状況の変化には再デプロイは不要**です。

初回はGitHubの **Settings → Pages → Source → GitHub Actions** を選び、リポジトリの `main` にサイトの中身を置いてください。`scripts/build_site.py` は `schedule.html` をサイトマップに含め、`assets/streams/` の画像も最適化対象にします。ローカルで直接公開する場合は、全ファイルをGitHub Pagesへ配置するだけでもページは表示されます（自動SEO生成/画像最適化はワークフロー利用時）。

### 5. セキュリティと公開前確認

- 配信者本人の公開同意・画像の使用許諾を確認する。
- GitHubの公開リポジトリには個人情報・応募審査情報・未発表の配信情報を保存しない。
- 誤って公開した場合はファイルを消すだけでなくGit履歴等への残存も確認する。
- 非公開にすべき情報の公開タイミングを `published:false` や `publishAt` だけに依存しない。
- 外部リンクと動作、スマートフォンでの閲覧、日本語と英語の表示を公開前に確認する。

---

# Live Craft 公式サイト Ver.4.5

**Ver.4.4の動画・イベント・NEWS・コラボ機能をすべて含む完成版。**

追加機能：
- `tools/recruitment-settings.html`：募集状態・応募フォーム・募集期間を設定して `config.js` を書き出す。
- `tools/content-manager.html`：公開メンバー・お知らせ・動画・イベント・コラボのローカル編集・JS書き出し（GitHubへは手動反映）。
- `.github/workflows/pages.yml`：push/手動/定期再デプロイ対応のGitHub Pagesワークフロー。GitHub Pagesの「Source」を**GitHub Actions**に切り替える必要があります。
- `scripts/build_site.py`：正規URL・OGP絶対URL・サイトマップ・robots・構造化データの生成。
- 公開用画像：必要に応じてWebPに変換し、公開成果物のパスを自動更新（元の素材は保持）。
- 応募・プロフィールの公開管理に関する運営マニュアル `OPERATIONS.md`。
- `publishAt` による画面上の公開開始日時の制御（**非公開の予約投稿機能ではありません**）。

最初に `OPERATIONS.md` を読んで設定してください。応募者の個人情報や非公開情報はGitHubリポジトリへ置かないでください。SNSのメンバー別個別OGPは未実装です。

---

# Live Craft 公式サイト Ver.4.4

Ver.4.3の全機能を維持。新ページ：VIDEOS (`videos.html`)、EVENTS (`events.html`)、COLLABS (`collabs.html`)、NEWS記事 (`news-article.html?id=...`)。

追加データ：`assets/videos.js`、`assets/events.js`、`assets/collabs.js`。いずれも `published: true` の公開許諾済み情報のみを登録。未登録時は準備中表示。

NEWSは `assets/news.js` の項目に `id`（固有ID）、`thumbnail`（任意）、`publishAt`（任意）を追加できます。検索と記事詳細へ対応します。画像は `assets/news/` に配置。

`publishAt` はブラウザー表示開始の目安であり**非公開機能ではありません**。未発表情報・個人情報はGitHubの公開リポジトリへ入れないでください。

新規ページをトップ / ACTIVITIES / フッターから導線追加。既存の応募、メンバー、FAQは継続します。

---

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
