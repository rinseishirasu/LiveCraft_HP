# Live Craft Ver.5.0.5 修正内容

## 不具合：週間配信スケジュールに配信予定が表示されない

Ver.5.0.4 の `schedule.html` は配信予定を取得する前にメンバー情報を読み込んでいませんでした。`stream-engine.js` は `memberId` を、`assets/members.js` 内の公開メンバー `id` に照合した後、公開予定を抽出する設計です。これにより `schedule.html` では予定がすべて除外され、`member.html` では予定が表示される不整合が起きていました。

### 修正

`assets/stream-engine.js` より前に `assets/members.js` と `assets/member-routing.js` を読み込むように修正しました。登録済みデータの形式・内容、プロフィール表示、配信予定の時刻判定ロジックは変更していません。

### Ver.5.0.4 からの更新

1. 事前に現在の `schedule.html` をバックアップします。
2. 修正パッチ内の `schedule.html` をGitHubリポジトリのルート（`index.html` と同じ階層）へ上書きします。
3. コミットしてGitHub Pagesの反映を確認します。
4. ブラウザーを強制再読み込みし、今週のスケジュールを確認します。別の週の配信は「次の週」で表示してください。

**既存の `assets/members.js` と `assets/streams.js` は変更しないでください。**

## 予定が引き続き見えない場合の確認事項

- `assets/streams.js` の `memberId` が公開済みメンバーの `id` と一致している。
- 対象のメンバーと予定の両方が `published: true`。
- 開始・終了日時が `YYYY-MM-DDTHH:mm:ss+09:00` 形式で、終了が開始より後。
- `status` が通常の予定では `scheduled` に設定されている。
- カレンダーは**選択中の週**に開始する配信予定のみ表示する。別の週に開始する予定は前後の週へ移動して確認する。
- GitHub Pagesの公開元に更新した `schedule.html` が反映されている。

## 検証

- 実ブラウザーへのHTML/CSS/JS直接読み込みで、修正前「予定0件」→ 修正後「テスト予定1件」を再現。
- Node.jsの配信予定判定テスト・アイコン分離テスト・プラットフォームテストを通過。
- GitHub Pages向けのビルドを通過。
- テスト用のメンバー・配信予定データは配布版に含めていません。
