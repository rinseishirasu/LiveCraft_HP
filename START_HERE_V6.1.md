# Live Craft Ver.6.1 導入と更新

## 既にVer.6.0最終統合版を使っている場合

1. 可能なら現行リポジトリのバックアップ／Gitのコミットを確認する。
2. `Live_Craft_v6.0_最終統合版_to_v6.1_統合更新パッチ.zip`を解凍する。
3. 中の`live-craft-v6.1/`の**内容**をGitHubリポジトリのルートに上書き・追加する。
4. 特に`start.html`、`projects.html`、`project.html`、`assets/v61.css`、`assets/v61.js`、`assets/projects.js`、`.github/workflows/manage-projects.yml`、`tests/v61.test.cjs`が存在することを確認する。
5. GitHub ActionsのPagesを新しく実行し、公開サイトで確認する。

パッチには登録済みの`assets/members.js`、`assets/news.js`、`assets/streams.js`、`assets/videos.js`、`assets/events.js`、`assets/collabs.js`、`assets/config.js`を含めていません。フル版は初期状態のデータファイルを含むので、既存サイトへそのまま一括上書きしないでください。

## PROJECTS登録

GitHub Actions → **Live Craft | PROJECTS管理** → Run workflow。

| 項目 | 例・目的 |
|---|---|
| `operation` | upsert / hide / delete |
| `id` | project-01。公開URLの固定ID |
| `title`, `summary`, `description` | 公開に同意した企画名と紹介文 |
| `status` | upcoming / ongoing / completed。空欄は変更しない |
| `category` | ゲーム、歌、記念企画など |
| `cover` | `assets/projects/project-01.webp`。先にGitHubのCode画面から画像を登録 |
| `members` | 公開メンバーの**固定ID**をカンマ区切りで登録 |
| `relatedVideos`, `relatedCollabs` | `videos.js`／`collabs.js`にある公開コンテンツの固定ID |
| `startDate` | YYYY-MM-DD。任意 |
| `externalUrl` | 公開済みの企画・配信ページ（https://） |
| `featured` | true ならトップで優先表示 |
| `published` | true で公開、false で非公開、keep で現状維持。新規登録は初期値false |

既存項目は入力欄を空のままにすれば原則保持します。公開リポジトリのソースは誰でも読めるので、未発表情報は**published=falseでも登録しないでください**。

## 初見向け動画

- `assets/members.js`の`introVideoUrl`をGitHub Actionsのメンバー管理 `extras_json` で設定できます。
- 公開済みの`videos.js`でメンバーに紐付く動画のうち、`featured=true`を設定した動画も紹介対象です。
- 初見向け動画がなければ無理に枠を表示せず、メンバーの通常プロフィールを維持します。

`extras_json`入力例:

```json
{"introVideoUrl":"https://www.youtube.com/watch?v=EXAMPLE"}
```

## 衣装・ビジュアルの登録

メンバー本人・画像制作者の掲載許諾を確認したうえで、`assets/members/` に画像を置きます。
既存の`fullbody`がある場合はメインビジュアルとして自動的に表示します。追加衣装は`extras_json`で登録できます（最大8点）。

```json
{"outfits":[{"label":"新衣装","image":"assets/members/new-outfit.webp"},{"label":"記念イラスト","image":"assets/members/anniversary.webp"}]}
```

複数のメンバーのアイコン・立ち絵の指定を取り違えないよう、一覧用`avatar`と立ち絵`fullbody`は従来どおり別々のファイルです。

## その他

- 公開サイトのナビゲーション、フッター、横断検索にはPROJECTS導線が追加されます。
- 企画に参加した公開メンバーの個別ページには関連する公開企画が表示されます。
- GitHub Pagesのみの静的構成を維持し、YouTube/Twitch APIや外部バックエンドは必要ありません。
