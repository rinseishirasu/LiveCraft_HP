# Live Craft Ver.6.0最終統合版 → Ver.6.1 統合更新パッチ

このZIPは Ver.6.0「最終統合版」からの更新用です。展開後 `live-craft-v6.1/`の**中身**を既存リポジトリのルートに配置してください。

## 登録済みデータを保持するために

このパッチに、以下のファイルは含まれていません。
- assets/members.js
- assets/streams.js
- assets/news.js
- assets/videos.js
- assets/events.js
- assets/collabs.js
- assets/config.js

GitHubで独自編集したHTML/CSS/JSがある場合は上書き前にバックアップしてください。GitHubの元のコミットから復元することもできます。

## 必須の新規ファイル

start.html、projects.html、project.html、assets/projects.js、assets/v61.js、assets/v61.css、.github/workflows/manage-projects.yml、tests/v61.test.cjs、assets/projects/フォルダー。

`.github/workflows/`・`tests/`・`scripts/`を含め、パッチのディレクトリ構造をそのままリポジトリのルートへ置いてください。

GitHub ActionsのPagesで新規実行し、公開完了後に START HERE・PROJECTS・プロフィールを確認してください。

注記：PROJECTSのデータは初期状態で空です。公開同意を得た企画をGitHub Actions「Live Craft | PROJECTS管理」から登録してください。
