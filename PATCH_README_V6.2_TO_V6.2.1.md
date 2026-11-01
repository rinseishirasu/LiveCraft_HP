# Live Craft Ver.6.2 -> Ver.6.2.1 LOOK BOOK サブフォルダー対応修正

## 問題
メンバーの画像を `assets/members/<メンバーID>/` に保存すると、`members.js` の `outfits` に正しく記載しても、LOOK BOOK・メンバーカード・メイン立ち絵で画像が表示されないことがありました。GitHub Actionsの登録フォームも同じ画像パスを拒否していました。

## 変更内容
- LOOK BOOK: `LiveCraftMembers.safeAvatar()` で衣装画像を安全に解決（サブフォルダー対応）
- メンバーアイコン、詳細立ち絵、トップページのアイコン画像でもサブフォルダーを許可
- GitHub Actionsの管理スクリプトで `assets/members/<メンバーID>/画像.png` とさらに深いサブフォルダーに対応
- `../`、空のパス区切り、外部URL、未対応拡張子は引き続き拒否
- 既存のテストを拡張し、登録・表示判定の両方を検証

## 反映方法（既存の公開データを保持）
1. 修正パッチを解凍し、**内容をリポジトリ直下**へ同じフォルダー構成で上書きしてください。
2. `assets/members.js` と `assets/members/` の画像は変更しません。既存の登録内容を保持してください。
3. GitHubにコミットし、最新の `main` コミットでPages公開ワークフローを実行します。
4. `member.html?id=<対象ID>` のLOOK BOOKで「メインビジュアル」と追加衣装ボタンを確認してください。
5. キャッシュが残る場合は強制再読み込みしてください。

### outfitsの登録例
`Live Craft | メンバー管理` → `operation=upsert` → `id=<対象ID>` → `extras_json`:

```json
{"outfits":[{"label":"私服","image":"assets/members/member-a/casual.png"},{"label":"夏衣装","image":"assets/members/member-a/looks/summer.webp"}]}
```

`outfits` の更新は追加ではなく配列の置き換えです。既存衣装を残すには、既存分と新規分をすべて指定してください。最大8枚です。

## データ保護
本パッチには登録済みの `assets/members.js`、`assets/streams.js`、NEWS、動画、PROJECTSなどの公開データ、画像ファイルは含めていません。GitHubリポジトリ上の既存ファイルを維持します。
