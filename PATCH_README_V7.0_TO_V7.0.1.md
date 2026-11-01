# Ver.7.0 → Ver.7.0.1 配色改善パッチ

## 適用方法

1. GitHubリポジトリの `main` ブランチをバックアップ、またはコミット履歴を確認してください。
2. このZIP内の `assets/v7.css` と `studio/studio.css` を、リポジトリの同じ位置へアップロードして上書きしてください。
3. `main` ブランチへコミットし、GitHub Actionsの Pages デプロイ成功を確認してください。
4. ブラウザーを強制再読み込みして、HOME・メンバー一覧・SCHEDULE・`/studio/` の表示を確認してください。

## 安全性

- このパッチには `assets/members.js`・`assets/streams.js`・PROJECTS・NEWS・動画・イベント・コラボ等の登録データ、画像、HTML、JavaScriptは含まれません。
- 旧バージョンの機能・リンク・メニュー構成・LOOK BOOK・CREATOR DESKの処理はそのままです。
- CSSを独自に変更している場合には上書き前に差分を確認してください。
- なお全ソースZIPは新規構築・参照用です。既存データを保持したい場合にはパッチを適用してください。
