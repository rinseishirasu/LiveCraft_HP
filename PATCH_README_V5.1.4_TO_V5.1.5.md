# Ver.5.1.4 → Ver.5.1.5 修正パッチ

**GitHubへ上書きするファイル**

- `.github/workflows/_manage-and-publish.yml`
- `.github/workflows/audit-existing-data.yml`
- `.github/workflows/pages.yml`
- `tests/_fixtures.cjs`（新規）
- `tests/data-format.test.cjs`（新規）
- `tests/manage-content.test.cjs`
- `tests/legacy-inventory.test.cjs`
- `RELEASE_NOTES_v5.1.5.md`

このパッチは既存の `assets/` 内のデータを上書きしません。GitHub上で上記ファイルをコミット後、Actionsの管理フォームを新規実行してください。
