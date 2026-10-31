# Ver.6.1.1 → Ver.6.2 更新パッチ

**このパッチは既存の公開登録データを更新しません。**

## 手順
1. 事前にGitHubのリポジトリのバックアップを取得してください。
2. パッチZIPを解凍し、ZIP直下の `assets/`、`.github/`、`scripts/`、`tests/`、各 `.html` を、GitHubのリポジトリの同名フォルダ・同じ階層にアップロードしてください。
3. `tests/tests/` や `assets/assets/` と二重にならないように注意してください。
4. `.github/workflows/` 内の更新ファイルを忘れずに反映してください。
5. 変更をコミットし、GitHub Actionsの新しい `main` ブランチ実行を確認してください。過去の失敗ジョブの再実行では更新前の状態が使われることがあります。
6. GitHub Pagesが公開されたら `fan.html`、`anniversaries.html`、`archives.html`、`schedule.html` を確認してください。

## 既存データ保持
更新パッチから除外するデータファイル：
`assets/members.js`, `assets/streams.js`, `assets/news.js`, `assets/videos.js`, `assets/events.js`, `assets/collabs.js`, `assets/projects.js`, `assets/config.js`。

公式サイト一式ZIPには配布用の空データ例が含まれます。**公開済みサイトには一式ZIPを上書きせず、必ず更新パッチを使ってください。**

詳しい新項目は `FEATURES_V6.2.md` を参照してください。
