# Ver.5.1.6 → Ver.6.0 公式サイトのデザイン更新

## 何が更新されるか

- `assets/v6.css`（新規ファイル）
- ルート直下のHTML17ファイル（共通ヘッダー・フッター・ページビジュアル）
- `RELEASE_NOTES_v6.0.md` と `DESIGN_V6.md`

**メンバー・配信予定・NEWS・動画・イベント・コラボ・募集設定の登録データは、このパッチに含まれません。**
GitHub Actionsおよび管理スクリプトも変更しません。

## GitHubの更新手順

1. 現行のGitHubリポジトリで問題なく動作している状態を確認しておきます。可能なら別ブランチにバックアップを作成します。
2. パッチZIPを解凍し、**中にあるファイルをリポジトリのルートへコピー**します（HTMLは上書き、`assets/v6.css`は新規追加）。
3. `assets/members.js`、`assets/streams.js`、`assets/news.js`、`assets/config.js` などは既存のものをそのまま残します。
4. コミット後、GitHub Actionsのページ公開が成功するのを待ちます。
5. 公開後に `index.html`、`members.html`、`schedule.html`、`news.html`、`join.html` とスマホ画面を確認します。必要に応じて強制再読み込みをします。

## 個別カスタマイズについて

今回のパッチは公開HTML17ページを更新します。これらをGitHub上で個別カスタマイズ済みの場合は、上書きで変更が失われます。必要なら差分を確認し、個別修正をマージしてください。

## データと機能

配信予定は従来どおり `assets/streams.js` と公開済みのメンバー情報から描画します。自動API連携は追加していません。
メンバー一覧のアイコン用 `avatar` と詳細用 `fullbody` の分離、主要プラットフォーム検索、GitHub Actions管理も従来どおりです。
