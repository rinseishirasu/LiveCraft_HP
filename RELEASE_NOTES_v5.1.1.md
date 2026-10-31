# Live Craft Ver.5.1.1｜既存登録データ管理の改善

## 何が変わる？

GitHub Actionsの「Live Craft | 既存データ確認・ID補完」から、現行リポジトリに**すでに登録されている**メンバー・配信予定・NEWS・動画・イベント・コラボ・募集設定を確認できます。新規追加しなくても、既存レコードの固定IDを探して、Ver.5.1の個別管理フォームで編集できます。

### 追加機能

- **一覧・検索（inspect）**：Actionsの実行結果 `Summary` に登録済みID、名前・タイトル、公開状態、IDの異常を表示。7種類を一括確認またはカテゴリー別に検索できます。全件のメタデータは実行結果の `Artifacts` にJSON形式で7日間保管されます。
- **旧データのID補完（migrate）**：以前のバージョンで直接JSを編集したためIDがないレコードに、`legacy-members-0001` のような固定IDを自動付与します。対象データの既存項目を保持し、コミットとGitHub Pagesへの公開まで同一Actionで完結します。
- **安全性**：公開フラグが未設定の旧レコードは、誤公開防止のため `published:false` にします。既存の `published:true/false` は維持します。重複ID・不正IDや不正な配列レコードは移行を停止し、推測で変更しません。
- **既存データ保護**：管理フォーム側でID不正・ID重複・IDなしの登録を検出すると編集を停止するため、意図しない行を更新しません。`upsert` は同じIDなら部分更新し、空欄は既存値を保持します。
- **配信参照チェック**：スケジュールの `memberId` が現在のメンバーIDと結び付かない場合、監査結果に警告します。これは自動変更しません。

## GitHubでの操作方法

1. `Actions → Live Craft | 既存データ確認・ID補完 → Run workflow` を開く。
2. `mode=inspect`、`resource=all` またはカテゴリーを選択する。検索したい場合だけ `query` に活動名・タイトル・ID・所属事務所を入力。
3. 実行完了後、ジョブの `Summary` で登録済みIDを確認。多い場合はArtifactsのJSONファイルを確認。
4. 「ID未設定」の場合、同じActionsで `mode=migrate`、`resource=all`、`query` は空欄にして実行。ID補完後の一覧を再確認。
5. `Actions → Live Craft | メンバー管理`（またはNEWS等）で `operation=upsert`、対象ID、変更する項目だけを入力して実行する。`published=keep` で既存の公開状態を保持できます。
6. デプロイ成功後、HOME・MEMBERS・NEWS・SCHEDULEなどで表示を確認する。

## 注意点

- **既存の非公開・応募情報はGitHub上で秘密になりません。** Actionsの入力・ログ、公開リポジトリの履歴には機密データを保存しないでください。
- 一覧検索はデフォルトブランチの登録内容を参照します。GitHub Actionsの入力欄へ既存値を自動入力する機能はGitHubの標準フォームでは提供できません。
- IDが不正・重複している場合はGitHubのCode画面などで手動修正してください。外部URLで利用中のIDを勝手に変更するとリンクが切れる場合があります。
- `memberId` が古いIDを参照している配信予定は、別途メンバーIDとの照合・更新が必要です。
- GitHub Actionsの `GITHUB_TOKEN` による自動コミットは、通常のpushイベントだけでは別ワークフローを再起動しないことがあるため、ID移行・公開を同一ワークフローで行います。
- GitHub Pagesの公開設定、Actionsの書き込み権限、ブランチ保護ルールにより更新が制限される場合があります。

## 更新ファイル

- `.github/workflows/audit-existing-data.yml` （追加）
- `scripts/legacy_inventory.cjs` （追加）
- `scripts/manage_content.cjs` （安全チェック追加）
- `tests/legacy-inventory.test.cjs` （追加）
- マニュアル類

サイトの公開ページ・CSS・公開登録データファイルの内容は変更していません。Ver.5.1からのアップデートは差分パッチがおすすめです。
