# Ver.7.0.4 → Ver.7.0.5 更新パッチ

- ZIPを展開後、含まれるファイルを**同じ階層**のGitHubリポジトリに上書き／追加してください。
- `assets/members.js`, `assets/streams.js`, `assets/projects.js` など登録データと、画像ファイルはパッチに含めていません。
- JavaScriptの追加とHTMLの読込変更が必要です。HTML独自編集がある場合は適用前に差分を確認してください。
- `main` コミット後、GitHub Pagesのbuild/deploy完了を確認してください。
- 動作確認: メンバー一覧で0期生と10期生のラベル・色が表示されること、/studio/で0〜10期生が選べること。
- 期生カラーは `assets/generation-colors.js` にまとめています。
