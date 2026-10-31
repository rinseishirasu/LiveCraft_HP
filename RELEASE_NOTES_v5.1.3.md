# Live Craft Ver.5.1.3｜GitHub Actions / Node.js 24互換性修正

GitHub ActionsのJavaScriptアクションに残っていたNode.js 20系の警告に対応しました。

- `actions/checkout@v4` → `@v5`（共通管理・既存データ確認）
- `actions/setup-node@v4` → `@v5`（共通管理・既存データ確認）
- `actions/setup-python@v5` → `@v6`（共通管理・既存データ確認・公開）
- 既にNode.js 24対応の `actions/checkout@v6` は `pages.yml` で維持します。
- GitHub Actionsで失敗した場合、ジョブの `Summary` にトラブルシューティングの案内を追加します。
- Ver.5.1.2のプロフィールモーダル修正、7つのGitHub管理フォーム、既存データのID補完機能をすべて保持します。

**注意:** `Process completed with exit code 1` の真因は実際の失敗ステップを確認する必要があります。今回の修正で解決するのは、既知の古いAction実行環境への対応です。GitHubリポジトリ上での実行・デプロイは未検証です。詳細は `ACTIONS_ERROR_GUIDE.md`。
