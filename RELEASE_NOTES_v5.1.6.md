# Live Craft Ver.5.1.6 リリースノート

## 修正
- GitHub Actions で `tests/data-format.test.cjs` が見つからず失敗する事象への対処。
- Ver.5.1.5 に含まれていた全7種類のテストと `_fixtures.cjs` を、更新パッチに完全収録。
- 管理処理・旧データ監査・Pages ビルド用ワークフローに、テスト・スクリプトの事前存在チェックを追加（合計4ジョブ）。
- ファイル不足時、見つからない相対パスと導入方法を GitHub Actions のログ／Summary に出力。

## 更新方法
1. Ver.5.1.6 修正パッチ ZIP を解凍。
2. **中身**を既存 GitHub リポジトリのルートへ上書き。`tests/` フォルダーと `.github/workflows/` の階層を維持。
3. `tests/data-format.test.cjs` が GitHub の Code 画面で存在することを確認。
4. コミット後、Actions を新規実行。

**注意**: Ver.5.1.5 の全体版 ZIP には既に `tests/data-format.test.cjs` が入っていました。実際の GitHub 上でファイルが不足していた場合に必要なのは、ファイル配置の修正です。今回のパッチはアップロード漏れを是正しやすくするものです。

メンバーなどの既存 `assets/*.js` 公開データは更新パッチに一切含めていません。
