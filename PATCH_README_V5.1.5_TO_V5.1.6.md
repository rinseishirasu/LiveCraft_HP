# Ver.5.1.5 → Ver.5.1.6 修正パッチ

## 必ず確認すること
GitHub の Code 画面で **リポジトリ直下** の `tests/data-format.test.cjs` が存在することを確認してください。

## ZIPに含まれる内容
- `tests/` : 7個の `*.test.cjs` と `_fixtures.cjs` を全て含みます。
- `.github/workflows/` : `_manage-and-publish.yml`, `audit-existing-data.yml`, `pages.yml` 。不足ファイルの事前チェック追加。
- `ACTIONS_ERROR_GUIDE.md`, `RELEASE_NOTES_v5.1.6.md`。

ZIPの階層を維持してリポジトリに上書きしてください。`tests/tests/` や `live-craft-v5.1.6/tests/` という余分な階層に配置しないでください。
メンバーやNEWS、配信予定などのデータは変更しません。

**反映後は Actions の新しい実行を開始してください。** 古い失敗ジョブの Re-run は古いコミットを用いる場合があります。
