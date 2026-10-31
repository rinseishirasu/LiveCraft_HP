# Live Craft Ver.5.1.5 | 登録済みデータでActionsのテストが失敗する不具合を修正

## 修正した現象

`tests/manage-content.test.cjs` の実行時、公開中の `assets/members.js` に既存メンバーがいると
`Expected values to be strictly equal: '既存名' !== 'てすと🌷'` のような `AssertionError` が発生する。
これはメンバーデータの異常ではありません。旧テストは公開データを一時ディレクトリへコピーしたあと、
新規テストレコードが**先頭要素**になると仮定していました。

## 対応

- `tests/_fixtures.cjs`: **実データをコピーせず**、毎回空のテスト用データを生成。
- `tests/manage-content.test.cjs`: 7種類の管理テストをテスト専用データで実行。登録済みメンバーが存在する場合の、新規追加・部分更新・既存項目保持を回帰テストに追加。
- `tests/legacy-inventory.test.cjs`: 既存データに依存しないテスト環境へ統一。
- `tests/data-format.test.cjs`: 公開データは**読み込みのみ**で検証。メンバー数・登録順・名前は決め打ちしない。
- `.github/workflows/`: 管理・ID補完・Pagesのテスト手順に読み取り専用の公開データ検証を追加。

## 既存データと安全性

更新パッチには `assets/members.js`・`assets/streams.js`・`assets/news.js`・`assets/config.js` などの公開データは**一切含みません**。
既存メンバーを削除・変更する必要はありません。
テストの一時ファイルはシステムの一時ディレクトリに作成し、最後に削除します。
`data-format.test.cjs` は内容を書き換えず、データの読み込みと形式だけ検証します。

## 適用と確認

1. Ver.5.1.4を利用中なら、修正パッチの `tests/` と `.github/workflows/` および付属文書をGitHubリポジトリの同じ場所へ配置し、コミット。
2. GitHubの `Actions` から、失敗した管理操作を**新しく実行**（過去のRunをRe-runすると古いコミットのままになることがあります）。
3. `PASS: ... isolated fixtures ...` と `PASS: public content JavaScript loads ...` を確認。
4. ほかの失敗があれば、そのステップ内の最初のERRORを確認してください。

**注記**: GitHub上での実際の実行・デプロイは未実施です。ローカルでのテストとビルドのみ検証しています。
