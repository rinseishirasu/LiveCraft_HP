# Ver.6.0 機能統合版 → Ver.6.0 最終統合版

このZIPは、既存の機能統合版（お気に入り・カレンダー登録実装済み）を対象としています。

ZIP内にある `discover.html`、HTML・JS・CSSの更新ファイル、`scripts/`、`.github/workflows/`、変更された案内書を**リポジトリ直下**に配置します。

`assets/members.js`, `assets/streams.js`, `assets/news.js`, `assets/videos.js`, `assets/events.js`, `assets/collabs.js`, `assets/config.js` と画像は上書きしません。

GitHub ActionsのNEWS・イベント管理フォームに関連メンバーの入力欄が追加されます。公開サイトへ反映した後、メンバー詳細の関連活動を確認してください。

### 更新チェック

1. GitHubの Code 画面で `discover.html` と `assets/discover.js` の存在を確認。
2. `.github/workflows/manage-news.yml` と `manage-events.yml` の変更が反映されていることを確認。
3. Actions → Live Craft GitHub Pagesが成功することを確認。
4. MEMBERS・SCHEDULE・SEARCHのリンク、週間予定と個別プロフィールを確認。

**GitHub Pages本番環境での最終動作確認は公開後に必要です。**
