# Live Craft Ver.6.2 | FAN EXPERIENCE + LIVE EXPERIENCE

Ver.6.1.1 を基準に、旧計画 Ver.6.3（ファン向け体験）と Ver.6.4（配信予定強化）を統合して Ver.6.2 として発行します。

## 新規実装

### FAN EXPERIENCE
- `fan.html`（FAN PORTAL）：公開メンバーのファンネーム、ファンマーク、配信・ファンアートタグ、配信先、本人が登録した外部ファンクラブURLを一覧・検索。
- `anniversaries.html`：公開済みの誕生日（月日）とデビュー記念日を日本時間で直近約1年分表示。誕生年・年齢は扱わない。
- `archives.html`：公開承認済みの `assets/videos.js` からおすすめ動画・配信アーカイブを検索。管理用データを新設せず既存の動画管理に連動。
- `member.html`：本人の公開情報を使う応援ガイドを追加。
- 応援カード：会員登録なしで個人別のSVGカードを生成・保存。会員証や公式認証を意味しない。
- `index.html`：FAN PORTALへの入口と近い記念日を追加。

### LIVE EXPERIENCE
- `schedule.html`：週間・月間表示を切り替え。月間は各日に予定を集約し、日付を選ぶと詳細カードを表示。
- 「毎週」「隔週」の繰り返し予定に対応。登録は元データ1件で、画面内で各回を展開。終了日は開始日から366日以内、最大53回。
- 登録済みのサムネイルを週間の小型予定カードにも表示。
- 中止・延期ラベルの視認性を向上。予定の状態は手入力を信頼して表示、YouTube/Twitch等での実配信を保証しない。
- URL共有は月間表示・月指定を含めて反映、表示中の週間または月間予定を `.ics` 形式で書き出し。

### GitHub Actions
- `manage-streams.yml` に `repeat`（none / weekly / biweekly）と `repeatUntil`（YYYY-MM-DD）を追加。
- `manage-members.yml` に `fanClubUrl`・`fanClubLabel`・`fanGuidelinesUrl` を追加。既存の `extras_json` による fanName、fanMark、streamTag、fanArtTag、birthday、debutDate も継続利用可能。
- 管理スクリプトは繰り返し日数・URLの検証を追加。`repeat=none` で既存終了日を解除。
- `tests/v62.test.cjs` を全管理・デプロイのテストに追加。

## 公開範囲と運用上の注意
- サイトで扱うのは本人が一般公開に同意した情報のみ。内部ナレッジ、準備中の企画、会員限定資料は追加しない。
- 外部ファンクラブに関する課金、契約、個人情報処理は各外部サービスで行う。Live Craft公式サイトには会員認証・課金を追加しない。
- GitHub Pages上のJSデータは公開状態。`published:false` でもリポジトリ内の情報を秘匿できない。
- 繰り返しシリーズで `cancelled` / `postponed` を指定するとシリーズ全体に同じ状態が適用される。個別回のみ変更するときは、シリーズを調整して個別の公開予定を登録する運用が必要。
- 新規追加された項目が未設定なら、既存のメンバープロフィール・予定・動画は引き続き表示できる。

## 検証範囲
- 既存テストと Ver.6.2新テスト、JavaScript構文、GitHub Actions YAML、公開用ビルド。
- PC 1440px とスマホ 390px でトップ、FAN PORTAL、記念日、ARCHIVES、SCHEDULE、MEMBERの12画面。検索、応援カード作成、月間カレンダー、日付展開を確認。
- GitHub本番リポジトリへの実際のデプロイは未検証。
