# Ver.6.0 最終統合版について

既存データを保護するため、すでにサイトを公開している場合は**フルZIPではなく差分パッチ**を利用してください。詳細は `FEATURES_V6_FINAL.md` を参照してください。

# Ver.6.0 機能統合版のお知らせ

最新機能については `FEATURES_V6.md` を参照してください。前版からの更新では既存データファイルを上書きせず、該当するパッチを利用してください。

---

# Live Craft 公式サイト / Ver.6.0

**最新リリース: Ver.6.0（全17ページのデザイン刷新）**。配布物に含まれる `RELEASE_NOTES_v6.0.md`、`DESIGN_V6.md` をご覧ください。Ver.5.1.6の運用中ならデータを保護するため差分パッチの適用を推奨します。デザイン以外のGitHub Actions管理・配信予定などの動作は保持しています。

---

# Ver.5.1.3｜GitHub Actions実行エラーの対処

1. Ver.5.1.2を利用中なら `PATCH_README_V5.1.2_TO_V5.1.3.md` に従ってワークフローを更新してください。
2. 新しいActions実行でNode.js 20非推奨警告が消えるか確認してください。
3. 引き続きexit code 1になる場合は `ACTIONS_ERROR_GUIDE.md` で失敗ステップを切り分けてください。

---

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
