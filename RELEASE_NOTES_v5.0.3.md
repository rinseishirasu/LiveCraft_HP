# Live Craft Ver.5.0.3 | メンバー画像の表示保護

## 確認結果
Ver.5.0.2の一覧の画像コードは `avatar` を参照していました。`fullbody` と取り違えて参照するコードは確認されていません。
ただし、メンバーデータで `avatar` に全身画像を指定した場合や、`avatar` と `fullbody` が同じファイルの場合は一覧にも全身画像が表示される可能性がありました。

## 変更内容
- `avatar` と `fullbody` が同じ画像パスの場合、一覧・ピックアップ・配信カードは画像を流用せず代替アイコンを表示。
- `tools/content-manager.html` に登録したアイコン・立ち絵のプレビューを追加。異なるパスであることを保存・書き出し時にチェック。
- 各プロフィールの `avatar` と `fullbody` の使い分けをコメントとREADMEに明記。
- 配信予定・期生・所属事務所など他の機能は維持。

## 登録例
```js
avatar: 'assets/members/your-icon.webp',       // 正方形の顔アップ画像
fullbody: 'assets/members/your-fullbody.webp', // 詳細専用の全身立ち絵
```

**注意**: 二つのファイル名が異なっていても、登録した `avatar` の画像そのものが全身立ち絵であれば一覧にはその画像が表示されます。画像内容の自動判定は行いません。正しいアイコン画像を登録してください。

## 更新方法
Ver.5.0.2からの差分ZIPは以下のファイルだけを上書きしてください。`assets/members.js` は含めていないため、既存メンバー情報は保持できます。

- `assets/member-routing.js`
- `assets/members-page.js`
- `assets/profile-ui.js`
- `assets/v41.js`
- `assets/v43-home.js`
- `assets/stream-widgets.js`
- `tools/content-manager.html`
- `tests/member-icon.test.cjs`

GitHub Pagesへの反映後に強制再読み込み（PC: Ctrl+Shift+R / Mac: Cmd+Shift+R）を試してください。
