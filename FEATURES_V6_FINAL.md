# Ver.6.0 最終統合版 追加機能ガイド

今回の最終統合版は、従来のデザイン刷新＋お気に入り＋配信カレンダー出力に、以下の4機能を追加しています。API・ログイン・外部DBは不要です。

## 1. SEARCH / DISCOVER 横断検索

`discover.html` で、**公開中の**メンバー・NEWS・動画・イベント・コラボの5種類のデータを1か所で検索できます。全ページのヘッダーとフッターからアクセス可能です。

キーワードは複数語にも対応し、カテゴリ別のフィルター、検索キーワードを含むURLの共有にも対応します。未公開のデータ（`published !== true` や公開開始前の `publishAt`）は表示しません。

検索対象は `assets/members.js`, `assets/news.js`, `assets/videos.js`, `assets/events.js`, `assets/collabs.js` の公開データです。規約・非公開応募資料などは検索しません。

## 2. UP NEXT 次に始まる配信

`schedule.html` の週間カレンダー上部に、開始時刻が近い公開予定を最大3件表示します。登録予定時刻に基づいて開始までの時間を表示します。

実際の配信状態は取得しません。YouTube/Twitch等の外部APIや視聴状況の取得もありません。

## 3. 週・メンバー・媒体のURL共有

SCHEDULEで選択した週・メンバー・媒体・お気に入り表示ON/OFFをURLに保存し、共有リンクとしてコピーできます。

例：`schedule.html?week=2026-11-02&member=creator-a&platform=YouTube`

**注意**：お気に入りの登録内容は端末・ブラウザ内に保存されます。`fav=1` でフィルターのON/OFFは共有できますが、実際に保存されているお気に入りメンバーの一覧は共有・同期されません。

## 4. メンバーページの関連活動

`member.html?id=...` に、そのメンバーに紐付く公開NEWS・動画・イベント・コラボを最新順に最大8件表示します。紐付く内容がなければセクションは表示しません。

以下のように既存データを利用します。

| データ | 紐付けするフィールド | GitHub Actionsの入力 |
| --- | --- | --- |
| NEWS | `members: ["creator-a"]` | NEWS管理の「関連メンバー」 |
| イベント | `members: ["creator-a"]` | イベント管理の「関連メンバー」 |
| コラボ | `members: ["creator-a", "creator-b"]` | コラボ管理の「参加メンバー」 |
| 動画 | `member: "配信活動名"` | 動画管理の「メンバー」 |

`members` にはメンバーの固定IDか活動名を、GitHub Actionsのフォームではカンマ区切りで入力します。個人情報や本人の公開同意のない内容を載せないでください。

既存の本文・活動履歴・立ち絵・配信予定・公開URLは維持します。旧データに `members` がない場合もエラーになりません。

## 更新方法

- 以前の **Ver.6.0 機能統合版**からは `Live_Craft_v6.0_機能統合版_to_最終統合版パッチ.zip` を利用。
- Ver.5.1.6からは `Live_Craft_v5.1.6_to_v6.0_最終統合版パッチ.zip` を利用。
- 各ZIPを解凍し、*中身*をリポジトリ直下に配置してコミットしてください。ZIPを丸ごと1ファイルとしてアップロードしないでください。
- パッチには既存の `assets/members.js`、`assets/news.js`、`assets/events.js`、`assets/videos.js`、`assets/collabs.js`、`assets/streams.js`、`assets/config.js` を含めません。
- 新しい `discover.html` と `assets/discover.js`、`assets/member-activity.js`、更新後の `.github/workflows/`、`scripts/manage_content.cjs` を含めて配置してください。
- 新規ページ `discover.html` は公開ビルドとサイトマップに含まれます。

配布パッチは登録済みデータを自動移行・削除しません。公開前にGitHubの変更履歴を確認してください。
