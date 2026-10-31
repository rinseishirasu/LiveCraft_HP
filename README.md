# Live Craft 公式サイト Ver.1.2（GitHub Pages）

ブラック × ダークネイビー × シルバー × ブルー。既存のLive Craftロゴを使用した、7ページ構成の静的サイト（MEMBERSはアイコン一覧＋クリックで詳細表示）です。

## ファイル構成

```text
live-craft-site/
├─ index.html           HOME
├─ about.html           理念・5つの価値観
├─ activities.html      活動内容
├─ members.html         所属メンバーのアイコン一覧＋詳細ポップアップ（本人同意した公開プロフィール）
├─ join.html            加入案内
├─ guidelines.html      コミュニティ規約（公開向け整形版）
├─ privacy.html         個人情報の取扱い・お問い合わせ
├─ 404.html             404ページ
├─ .nojekyll            Jekyll処理を抑止
└─ assets/
   ├─ style.css         デザイン全体
   ├─ config.js         募集状態・外部フォーム・規約日付の設定
   ├─ main.js           スマホメニュー・CTA表示の制御
   ├─ members.js        メンバー公開データ（要本人同意）
   ├─ members-page.js   アイコン一覧・詳細ポップアップ・ジャンル絞り込み
   ├─ members/          本人が掲載許可したプロフィール画像
   ├─ live-craft-logo.jpg  承認済みのLive Craftロゴ
   ├─ lc-mark.webp      承認済みロゴから抽出したLCシンボル
   └─ favicon.png       サイトアイコン
```

## 公開前に必ず変更する設定

`assets/config.js` を編集してください。

```js
window.LIVE_CRAFT_CONFIG = {
  recruitmentOpen: false,
  applicationUrl: "",          // 公開済みGoogleフォームの回答者用リンク
  contactUrl: "",              // 公開可能な問い合わせフォーム等のURL
  rulesEffectiveDate: "未定",   // 例: 2026年11月1日
  rulesVersion: "1.0"
};
```

- `recruitmentOpen` と `applicationUrl` の**両方**が設定されたときだけ、応募ボタンを表示します。
- `contactUrl` が未設定の場合、問い合わせは「準備中」と表示します。
- 規約本文は公開向けに要約・整形した版です。既存の正式な規約原稿と照合してから公開してください。
- `privacy.html` の内容は運営体制に合わせて最終確認してください。公開前に問い合わせ窓口も用意してください。
- 本リポジトリに応募情報、審査シート、メンバーの個人情報を置かないでください。

## GitHub Pagesへの公開手順

1. GitHubで新しい公開リポジトリ（例: `live-craft`）を作成します。
2. `live-craft-site/` **内のファイルとフォルダー全部**をリポジトリのルートにアップロードします。
3. リポジトリの `Settings` → `Pages` へ移動します。
4. `Build and deployment` → `Source` を **Deploy from a branch** にします。
5. Branch を `main`、フォルダーを `/(root)` にして保存します。
6. 公開後に表示されるURL（通常 `https://ユーザー名.github.io/live-craft/`）で各ページを確認します。

パスはすべて相対指定なので、GitHub Pagesのプロジェクトサイトでも表示できます。ビルドツール・Node.js・サーバー側プログラムは不要です。


## メンバー紹介ページの公開方法（MEMBERS｜Ver.1.2）

メンバーのプロフィールは `members.html` に表示されます。**初期状態では0名、準備中表示**です。
一覧には**アイコン画像のみ**を並べ、クリック／タップでプロフィールがポップアップ表示されます。詳細には活動名、役割、ジャンル、自己紹介、各配信サイト・SNSへのリンクが載ります。Escキー・背景のクリック・右上の×ボタンで閉じられます。
実在のメンバー名や画像などを勝手に公開しないよう、必ず本人の同意を確認してください。

1. 活動名、紹介文、ジャンル、役割、掲載するSNSリンク、アイコン画像を本人に確認します。
2. 画像を使う場合は本人の許可を得て `assets/members/` に配置します。ファイル名は英数字、ハイフン、アンダースコアのみ推奨です。
3. `assets/members.js` のコメント内の記入例を参考に、`window.LIVE_CRAFT_MEMBERS` 配列にプロフィールを追加します。
4. **公開を承認済みのプロフィールだけ `published: true` にします。** 非公開の場合は配列に入れない方が安全です。アイコン画像・詳細の文章・外部リンクのそれぞれについて同意を確認してください。
5. 公開ページで表示、リンク、モバイルレイアウトを確認します。

設定例（**架空のサンプル**。公開ファイルには初期登録されていません）：

```js
window.LIVE_CRAFT_MEMBERS = [
  {
    published: true,
    name: "サンプル配信者",
    role: "メンバー",
    genres: ["ゲーム", "雑談"],
    bio: "自分らしい配信を磨いています。",
    avatar: "assets/members/sample.webp",
    links: [
      { label: "YouTube", url: "https://www.youtube.com/@example" },
      { label: "X", url: "https://x.com/example" }
    ]
  }
];
```

`avatar` は省略できます。その場合は活動名の頭文字が表示されます（できれば本人が許諾したアイコン画像を登録してください）。アイコンは1:1の正方形・推奨512×512pxのWebPまたはPNGです。SNSリンクには `https://` 形式を使ってください。
一覧はPCで最大6列、スマートフォンでは3列です。活動名を一覧に表示せず、スクリーンリーダーには「○○のプロフィールを見る」と読み上げられます。
複数ジャンルのメンバーが登録されると、ジャンル絞り込みが表示されます。

**重要：`members.js` や画像は公開リポジトリに含まれるため、`published: false` としても情報が非公開になるわけではありません。** 非掲載者のデータはファイルに保存しないでください。公開後の削除でもGitの履歴に残る場合があります。非公開情報は絶対にコミットしないでください。

## 動作確認

- パソコンとスマートフォンでナビゲーションが開くか
- MEMBERS一覧のアイコンから詳細が開くか、×・背景クリック・Escで閉じるか
- アイコンが画像なしや存在しない場合、頭文字で表示されるか
- 7ページ間のリンクが動くか
- 応募フォームURL設定後、`JOIN US` から外部フォームへ進めるか
- 規約の施行日・問い合わせ先が確定しているか
- 事前に規約への同意確認を取れる応募フォームになっているか
- アップロード対象に個人情報が含まれていないか

## 技術構成

HTML + CSS + 最小限のJavaScript、外部CDN・外部フォント不使用。GitHub Pagesでそのまま公開可能です。
