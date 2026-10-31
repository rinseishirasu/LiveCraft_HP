# Live Craft Ver.5.1.2 → Ver.5.1.3 修正パッチ

1. GitHubリポジトリのルートに、パッチの `.github/workflows/` フォルダーを**構造を維持したまま上書き**します。GitHubのWeb画面にアップロードする場合、隠しフォルダー `.github` とその中の `workflows` に注意してください。
2. パッチ同梱の `ACTIONS_ERROR_GUIDE.md`・`RELEASE_NOTES_v5.1.3.md` は必要に応じてルートに配置できます。
3. コミット後、GitHub → Actions で以前失敗したワークフローを**新しく実行**し、更新後のログを確認します。
4. まだ `exit code 1` が発生する場合は、赤い × のステップとその直前のエラー文を `ACTIONS_ERROR_GUIDE.md` に沿って確認します。

このパッチには `assets/*.js` やメンバー画像、HTML、CSSの変更はありません。既存の登録済みデータは上書きしません。GitHub Pagesの Source は `GitHub Actions` に設定してください。
