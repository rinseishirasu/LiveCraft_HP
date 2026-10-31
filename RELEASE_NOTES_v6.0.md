# Live Craft Ver.6.0｜デザイン刷新＋新機能 統合正式版

Ver.6.0の全17ページ共通デザインを維持し、閲覧者向けの次の機能を追加しました。

## 新規機能

1. **メンバーのお気に入り**：MEMBERS一覧の☆またはプロフィールの「お気に入り」で登録・解除。登録したメンバーだけを一覧表示でき、ジャンル・期生・媒体・文字検索と組み合わせられます。
2. **お気に入りメンバーの配信予定**：SCHEDULE画面の「★ お気に入りのみ」で、保存済みメンバーの公開予定に絞り込めます。
3. **プラットフォーム別の配信予定**：YouTube / Twitch など、実際に予定へ登録されている配信媒体で絞り込みます。メンバー・お気に入りフィルターとの併用にも対応。
4. **予定のカレンダー登録 (.ics)**：各予定カードから1件ずつ、SCHEDULE画面から現在表示中の週の予定をまとめて書き出せます。JSTの予定時刻をカレンダー向けUTCに変換し、日本語・絵文字を保持します。中止・延期・手動終了の予定は書き出し対象外です。

## 維持した機能

- 全17ページのCreator Editorialデザイン（PC・スマホ）
- 期生・事務所・主要媒体・ジャンル検索、メンバープロフィール、LIVE予定バッジ
- NEWS / 動画 / イベント / コラボ / 募集設定 / GitHub Actionsからの管理
- APIフリーの時刻ベースLIVE予定判定と日英切り替え

## 動作と個人情報について

- お気に入りは端末のブラウザー内 `localStorage` のみで管理し、サイトやGitHubへアップロードしません。ブラウザーを変えたり履歴を消去した場合は引き継がれません。
- カレンダーは `.ics` ファイルとしてダウンロードされます。端末でファイルを開き、カレンダーへの追加を確定してください。自動同期・配信開始通知・実際の配信状態の検知は行いません。
- 実際のメンバー・配信データが入っている場合のみ各フィルターや予定ボタンが表示されます。
- `assets/members.js`、`assets/streams.js`、`assets/news.js`、`assets/config.js` 等の登録済み情報の更新は不要です。

## 変更・新規ファイル

- `assets/favorites.js`（新規）
- `assets/calendar-utils.js`（新規）
- `assets/members-page.js`、`assets/member-detail.js`、`assets/stream-widgets.js`（更新）
- `assets/v6.css`（追記）
- `members.html`、`member.html`、`schedule.html`、`index.html`（新機能UI・読み込みを追加）
- `tests/v6-features.test.cjs`（新規）
- `.github/workflows/pages.yml`、`.github/workflows/_manage-and-publish.yml`（新機能のテスト追加）

## テスト

- 既存のNode.jsテスト7件と新規テスト1件、計8件を実行
- PC / 390pxスマホ幅でのブラウザー操作確認、お気に入り・絞り込み、.icsダウンロード
- `scripts/build_site.py` によるGitHub Pagesビルド

実際のGitHub Pages環境へのデプロイ・本番公開は未実施です。公開後の検証が必要です。


## Final integrated release: discovery + connected activities

- Added `discover.html`: cross-content discovery for published members, NEWS, videos, events, collabs.
- Added an upcoming-streams strip and shareable filter URLs to `schedule.html`. Countdown is schedule-based only.
- Added linked public activity history to individual member profiles.
- NEWS and EVENT GitHub Actions support a comma-separated `members` field, retaining existing values when omitted.
- Added `discover.html` to the SEO sitemap.
- Kept all existing data files untouched in patch packages, including members, streams, videos, collabs, news, events, and config.
- See `FEATURES_V6_FINAL.md` for usage and limitations.
