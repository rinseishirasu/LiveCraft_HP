# Ver.5.1.1からの最初の操作

1. GitHubリポジトリに更新パッチを反映します（`assets/*.js`を上書きしません）。
2. `Actions → Live Craft | 既存データ確認・ID補完 → Run workflow` で `mode=inspect` を実行し、登録済みIDを確認します。
3. 旧形式の「ID未設定」があった場合のみ `mode=migrate` で安全に補完します。
4. 7種の既存管理フォームで `upsert` とそのIDを使い、変更する項目だけを更新できます。

詳細は [`RELEASE_NOTES_v5.1.1.md`](RELEASE_NOTES_v5.1.1.md) を確認してください。

---

# Live Craft Ver.5.1 クイックスタート

## 最初の設定

1. **既にVer.5.0.6を使っている場合は更新パッチ**をリポジトリに追加してください。`assets/members.js` 等のデータは絶対に上書きしないでください。
2. `.github/workflows/` のファイルがデフォルトブランチへアップロードされていることを確認。
3. `Settings → Pages → Build and deployment → Source` を **GitHub Actions** に設定。
4. `Actions` に「Live Craft | 配信スケジュール管理」「メンバー管理」「NEWS管理」「動画管理」「イベント管理」「コラボ管理」「募集・公式設定管理」が表示されることを確認。

## 配信予定の登録例

1. 先に「メンバー管理」で対象メンバーの固定IDを登録し、`published = true` にする。
2. `Actions → Live Craft | 配信スケジュール管理 → Run workflow`。
3. `operation = upsert`、`id = stream-001`、`memberId = member-001`、`title = 週末配信`、`startAt = 2026-11-01T20:00:00+09:00`、`endAt = 2026-11-01T22:00:00+09:00`、`published = true` を入力。
4. 実行して `update_build` と `deploy` が成功したら、サイトのSCHEDULEを更新して確認する。

## 他の管理

各種NEWSや動画、イベント、コラボ、募集受付の変更も、名前の対応するActionsワークフローから実行します。`upsert` は追加と編集、`hide` は非公開、`delete` は削除です。**既存レコードを更新する場合、空欄は通常「変更なし」**で、値を消したい欄には `__CLEAR__` を入力します。

## 注意

- GitHubに登録した情報は（`published=false` でも）公開リポジトリのソースや履歴から閲覧可能です。応募者の個人情報・審査情報・未発表情報は絶対に登録しないでください。
- 写真・立ち絵ファイルは別途GitHubのCode画面から `assets/members/` 等へアップロードします。
- GitHub Actionsの実行にはリポジトリ書き込み権限が必要です。
- GitHub Pagesへの実際のデプロイは提供ファイル内では行っていません。デプロイ後の確認が必要です。

詳しくは [`MANAGEMENT_V5.1.md`](MANAGEMENT_V5.1.md) を参照してください。
