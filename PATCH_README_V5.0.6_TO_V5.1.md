# Live Craft Ver.5.0.6 → Ver.5.1 更新パッチ

既存のLive Craft Ver.5.0.6リポジトリに、ZIPの中身を**同じ階層へ追加・上書き**してください。

このパッチには、サイトの公開データファイル（`assets/members.js`、`news.js`、`videos.js`、`events.js`、`collabs.js`、`streams.js`、`config.js`）を**含めません**。

主な変更ファイル:
- `.github/workflows/manage-*.yml` (7つ)
- `.github/workflows/_manage-and-publish.yml`
- `.github/workflows/pages.yml` (同時デプロイ競合の緩和)
- `scripts/manage_content.cjs`
- `tests/manage-content.test.cjs`
- `MANAGEMENT_V5.1.md`, `START_HERE.md`, `RELEASE_NOTES_v5.1.md`, `README.md`, `OPERATIONS.md`

**重要:** `.github` は隠しフォルダです。GitHubのリポジトリでは `.github/workflows/` に登録されていることを確認してください。古い `tools/` フォルダが残っていても公開サイトにはビルドされませんが、トークン入力方式の旧TOOLは今後使用しないでください。

GitHubのPagesソースはGitHub Actionsを指定し、`GITHUB_TOKEN`にContentsの書き込みが許可されているか確認してください。詳しくは `MANAGEMENT_V5.1.md` を参照してください。
