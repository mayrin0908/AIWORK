# Playwright E2E サンプルプロジェクト

Playwright による E2E テスト自動化の学習用サンプルです。
外部サイトに依存せず、**ローカルで完結**します（Node標準機能でサンプルのログイン画面を配信し、それをテスト）。

## 構成

```
playwright-sample/
├─ public/index.html          サンプルWebアプリ（ログイン→ダッシュボード）
├─ server.js                  依存ゼロの静的サーバー（テスト時に自動起動）
├─ playwright.config.ts       Playwright設定（webServer連携・3ブラウザ）
├─ pages/LoginPage.ts         Page Object Model の例
└─ tests/
   ├─ login.spec.ts               基本のログインテスト（POM利用）
   └─ login.data-driven.spec.ts   データ駆動テスト（因子×水準の例）
```

## セットアップ

```bash
cd playwright-sample
npm install                    # 依存インストール
npx playwright install         # ブラウザ本体を取得（初回のみ）
```

## テスト実行

```bash
npm test                       # 全テスト（ヘッドレス・3ブラウザ）
npm run test:ui                # ★UIモード（タイムトラベル・おすすめ）
npm run test:headed            # ブラウザ表示あり
npm run test:debug             # ステップ実行デバッグ
npm run report                 # 直近のHTMLレポートを開く
```

特定のブラウザ・ファイルだけ動かす例:

```bash
npx playwright test --project=chromium
npx playwright test tests/login.spec.ts
```

## テストコードの自動生成（codegen）

アプリを起動した状態で操作を録画し、テストコードを生成できます。

```bash
npm start                      # 別ターミナルでサンプルアプリ起動
npm run codegen                # 操作を録画してコード生成
```

## サンプルアプリのログイン情報

| 項目 | 値 |
|------|-----|
| メールアドレス | `user@example.com` |
| パスワード | `password123` |

## 実運用に向けたポイント

- **ロケーター**: `getByRole` / `getByLabel` / `getByTestId` を優先（DOM変更に強い）
- **待機**: `waitForTimeout`（固定待ち）は使わず、`expect().toBeVisible()` の自動リトライに任せる
- **設計**: 画面ごとに Page Object Model で操作を部品化
- **認証の高速化**: ログイン状態を `storageState` に保存して各テストで再利用
- **CI**: `CI=true` で retries やトレースが有効化される（GitHub Actions 連携が容易）
