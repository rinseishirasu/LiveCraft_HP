# Ver.6.2 運用ガイド

## 一般公開で使用するページ
- `fan.html`: ファン向け応援情報
- `anniversaries.html`: 記念日一覧
- `archives.html`: 配信・動画アーカイブ
- `schedule.html`: 週間 / 月間配信予定

## 応援ガイドを登録する
GitHub → Actions → `Live Craft | メンバー管理` → `Run workflow`。

- `id` は既存のメンバー固定IDを指定。
- `fanClubUrl` は本人が公開を許可したHTTPSリンク。無ければ空欄。
- `fanClubLabel` は外部FCの表示名。無ければ空欄。
- `fanGuidelinesUrl` は本人または所属事務所の公開済みガイドラインURL。無ければ空欄。
- `extras_json` に例のように公開情報を入力（変更したい項目だけ入力可能）：

```json
{"birthday":"04-15","debutDate":"2024-04-15","fanName":"クラフトメイト","fanMark":"✳️","streamTag":"#公開タグ","fanArtTag":"#公開FA"}
```

生年、本名、住所、会員番号等は入力しないでください。JSデータは閲覧者・Git履歴から見えます。
応援カードは公開情報だけからブラウザー内で生成し、SVGとして保存します。会員証ではありません。

## 配信の繰り返し登録
GitHub → Actions → `Live Craft | 配信スケジュール管理`。

1. いつもの `id`、`memberId`、`title`、`startAt`、`endAt` を入力。
2. `repeat` に `weekly`（毎週）または `biweekly`（隔週）を選択。
3. `repeatUntil` に最終日（例 `2027-01-31`）を入力。元の `startAt` から366日以内。
4. `published: true` にして公開。既存の登録データは追加のフィールドがなくても利用可能。
5. 繰り返しをやめる場合は既存レコードの `id` を指定して `repeat: none` にする（終了日も自動削除）。

中止・延期は一つのシリーズの全回に反映されます。個別回の中止・延期はシリーズの構造を調整するか、別IDで個別予定を登録してください。公開時刻は日本時間 +09:00 で入力します。

### サムネイル
`thumbnail` に `assets/streams/英数字ファイル名.webp` 等を設定。リポジトリに画像を置いてから参照してください。未登録時は従来のメンバーアイコン表示です。

### 配信予定と本当のLIVE
Live CraftではYouTube/Twitch APIを利用していません。開始予定時刻に達したことと、実際の配信開始・終了は別のものです。

## 動画アーカイブを追加する
既存の `Live Craft | 動画管理` から公開動画を登録します。`featured: true` は一覧の前方に表示されます。`category` を登録するとARCHIVESでカテゴリ検索できます。

## プライバシー
外部FC・二次創作のURLは必ず本人の同意と必要な権利確認を取ってから登録してください。メンバー限定の知識共有はサイトに載せず、アクセス制御のある別の場所で取り扱ってください。
