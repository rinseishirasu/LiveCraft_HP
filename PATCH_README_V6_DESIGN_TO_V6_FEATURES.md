# Ver.6.0 デザイン版 → Ver.6.0 機能統合版

`Live_Craft_v6.0_デザイン版_to_機能統合版パッチ.zip` を解凍し、**中身を**GitHubリポジトリのルートへ配置してください。

新規 `assets/favorites.js`、`assets/calendar-utils.js`、`tests/v6-features.test.cjs` を忘れずに追加してください。`assets/members.js` や `assets/streams.js` などの公開データを上書きしないパッチです。

`.github/workflows/` は隠しディレクトリです。GitHubのCode画面で正しい位置に配置してください。`tests/tests/` のような二重フォルダーにしないでください。変更をコミットして、新しいActions実行で確認してください。

`.ics` は予定をダウンロードする機能であり、カレンダーへの自動同期ではありません。
