# Live Craft Ver.5.1 → Ver.5.1.1 更新パッチ

このパッチをGitHubリポジトリの**ルートに、フォルダー階層を維持して**配置してください。

- `.github/workflows/audit-existing-data.yml` を新規追加します。
- `scripts/legacy_inventory.cjs` と `tests/legacy-inventory.test.cjs` を追加します。
- `scripts/manage_content.cjs` と `.github/workflows/_manage-and-publish.yml` を更新します。
- READMEや運用マニュアルを更新します。

**重要：** `assets/members.js`、`assets/streams.js`、`assets/news.js`、`assets/videos.js`、`assets/events.js`、`assets/collabs.js`、`assets/config.js` はパッチに含まれていません。登録済みのデータを上書きしません。

適用後は、GitHub → Actions → **Live Craft | 既存データ確認・ID補完** → Run workflow → **inspect** を実行してください。入力済みデータのIDと公開状態を確認できます。

IDが空の旧データがあるときだけ **migrate** を実行します。データのフィールドは保持され、IDなしのレコードに固定IDが付きます。以前から公開状態が未指定のレコードは安全のため非公開に設定します。

実際のGitHub Actions実行・本番デプロイはユーザーのリポジトリに接続していないため未実施です。ブランチ保護、ワークフロー実行権限、Pagesの設定を確認してください。
