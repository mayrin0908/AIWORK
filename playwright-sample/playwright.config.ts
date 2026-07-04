import { defineConfig, devices } from '@playwright/test';

// 設定リファレンス: https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests',
  // テスト内の各アクションのタイムアウトなどは expect の自動リトライで吸収される
  fullyParallel: true,
  // CI では test.only の消し忘れを検知して落とす
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // CI ではジョブごとに blob レポート（マージ可能な中間形式）を出力し、
  //   後段の merge ジョブで 1 つの HTML レポートに統合する。
  //   ブラウザ別ジョブでファイル名が衝突しないよう、環境変数で名前を差し替える。
  // ローカルではそのまま HTML レポートを出す。
  reporter: process.env.CI
    ? [['blob', { fileName: process.env.BLOB_REPORT_NAME || 'report.zip' }]]
    : [['html']],

  use: {
    baseURL: 'http://localhost:3000',
    // 失敗した最初のリトライ時だけトレースを残す（デバッグ用）
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // (1) 最初に一度だけ実行。ログインして storageState をファイルに保存する。
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // (2) 通常のテスト（クリーンな未ログイン状態から実行）。
    //     setup と authenticated 用のファイルは対象から除外する。
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/.*\.setup\.ts/, /.*\.authenticated\.spec\.ts/],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: [/.*\.setup\.ts/, /.*\.authenticated\.spec\.ts/],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: [/.*\.setup\.ts/, /.*\.authenticated\.spec\.ts/],
    },

    // (3) 認証済みテスト。setup が保存した storageState を読み込んでから実行。
    //     dependencies により setup の完了後に走る。
    {
      name: 'authenticated',
      testMatch: /.*\.authenticated\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  // テスト実行前にサンプルアプリを自動起動し、終了後に停止する
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
