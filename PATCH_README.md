# Live Craft 5.0.3 → 5.0.4 修正パッチの適用手順

1. 変更前にGitHubリポジトリのデータをバックアップしてください。
2. このパッチの中身をリポジトリの同じパスに上書きしてください。
3. **`assets/members.js` はこのパッチには含めていません。** 既存データを変更せずに保持できます。
4. 公開する各メンバーの `assets/members.js` のオブジェクトに次の項目を追記してください。

```js
primaryPlatform: "YouTube", // Twitch / TikTok LIVE / IRIAM / REALITY / ツイキャスなども可
primaryPlatformUrl: "https://www.youtube.com/@your-channel", // 任意。https:// の公開URL
```

5. GitHub Pagesの再デプロイ後、MEMBERSのプラットフォーム絞り込みと各メンバーの詳細画面を確認してください。

※主要媒体は `links` から自動推定しません。未設定のメンバーは「すべて」表示には残り、プラットフォーム別の絞り込みには該当しません。
※プロフィール掲載内容は本人の同意済みの公開情報だけにしてください。
