## Ver.6.3の追加診断

管理フォームは「公開前確認のみ」ONが初期値です。プレビューだけでは公開されません。レポートはActionsのArtifactsに保存されます。詳細はOPERATIONS_V6.3.md。

## `Cannot find module .../tests/data-format.test.cjs` の場合（Ver.5.1.6）

このエラーは Node.js のバージョンではなく、**GitHub リポジトリのルート直下に `tests/data-format.test.cjs` が存在しない**ことを示します。
Ver.5.1.5 の ZIP にこのファイルは含まれていますが、GitHub へのアップロード漏れがあると発生します。

1. GitHub の `Code` → `tests` を開いて `data-format.test.cjs` があるか確認します。
2. 存在しなければ、Ver.5.1.6 パッチの `tests/` 内にある **全ファイル** を、リポジトリの同じ `tests/` へアップロードします。`tests/tests/` などの二重階層にしないでください。
3. `.github/workflows/` の修正版も同じ階層に上書きし、コミットします。
4. GitHub Actions で **新しい実行**を開始します。古い失敗ジョブの「Re-run jobs」は、過去のコミットを使うため避けてください。

Ver.5.1.6 からは、必要ファイルに不足がある場合、Actions が最初に不足パスをまとめて表示します。メンバー・NEWS・配信予定のデータを変更する必要はありません。

# Live Craft Ver.5.1.3｜GitHub Actionsエラー対処ガイド

## ① Node.js 20 is deprecated

**警告です。** 元の設定に含まれていた `actions/checkout@v4`、`actions/setup-node@v4`、`actions/setup-python@v5` をそれぞれ `@v5`、`@v5`、`@v6` に更新しました。これらのActionの内部実行環境はNode.js 24に対応します。

- GitHub提供の `ubuntu-latest` ランナーを前提にしています。セルフホストランナーでは少なくともv2.327.1以降が必要です。
- `node-version: '22'` は **Live Craft管理スクリプト実行用** のNode.jsバージョン指定であり、①のAction実行環境警告とは別です。Node.jsのスクリプトを24へ上げなくても①は解消できます。
- 一部古いワークフローの実行履歴には警告が残ります。**更新後の新しい実行ログ**で確認してください。

## ② Process completed with exit code 1

`exit code 1` 単独では原因を判定できません。GitHub → **Actions** → 失敗した実行 → 赤い `×` が付いたジョブ → **最初に失敗したステップ**を展開し、最後の `exit code 1` より前にある**最初の実際のエラー文**を調べてください。Ver.5.1.3は、失敗時の `Summary` に確認先を表示するようにしています。

| 赤くなったステップ | 確認すること |
| --- | --- |
| Checkout | リポジトリのアクセス権限、デフォルトブランチとブランチ保護 |
| Setup Node / Setup Python | ランナーの更新状況、ランナーが外部のセットアップファイルへアクセスできるか |
| Update the selected content data | 既存のID、入力フィールド、日時書式、URL、登録ファイルのJavaScript構文 |
| Test before saving / Run regression tests | 失敗したテスト名と `AssertionError` の文面。処理は保存前に停止します |
| Commit validated change / Commit only existing public-data sources | `remote: Write access to repository not granted` / `403` / `protected branch` / `ruleset` などのエラー。以下の権限を確認 |
| Install image optimizer | Pillow のインストール時のエラー |
| Configure Pages / Upload Pages build | `Settings → Pages → Build and deployment → Source` を `GitHub Actions` に設定 |
| Deploy to GitHub Pages | Pages公開権限・`github-pages` 環境の保護ルール・Pagesの有効化を確認 |

### GitHub書き込み権限のチェック

`Settings → Actions → General → Workflow permissions` で、リポジトリの設定を確認してください。ワークフロー側には更新時の `contents: write`、デプロイ時の `pages: write` と `id-token: write` を指定していますが、組織のポリシーやルールセットで制限される場合があります。**デフォルトブランチが保護されている場合、GitHub Actionsのボットがpushできず失敗することがあります。** その場合は保護を無条件に外すのではなく、運用方針に合わせた例外設定やPull Request方式をご検討ください。

### Actionsで確認できること

- `Live Craft GitHub Pages` は `pages.yml` を実行します。
- 各管理メニューは `_manage-and-publish.yml` を再利用しています。
- `既存データ確認・ID補完` は `audit-existing-data.yml` を実行します。
- 失敗の理由はジョブ・ステップごとに異なるため、画面下の `exit code 1` だけでは診断できません。

### サポート用ログの共有

エラーが続く場合は、失敗したワークフロー名、**赤い × のステップ名**、そのステップのエラー箇所（通常末尾から20〜40行）を共有してください。**トークン・個人情報・秘密情報は伏せてください。** GitHubの実行URLが分かる場合はURLでも構いません（閲覧可能な権限の範囲に限ります）。

### 既存データの保護

この更新パッチは `.github/workflows/` とドキュメントのみを変更し、`assets/members.js`、`assets/streams.js`、`assets/news.js` などの公開データファイルを変更しません。

## 登録済みデータがある場合のテストAssertionError（Ver.5.1.5修正済み）

`Expected ... てすと🌷` と実際のメンバー名の比較で失敗する場合、Ver.5.1.4以前のテストが本番データの先頭要素を見ていたためです。Ver.5.1.5のパッチを適用してください。実在するメンバーの登録を削除する必要はありません。
