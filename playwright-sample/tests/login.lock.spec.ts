import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * 要件サンプル「ログイン機能」T-01〜T-04 の自動化。
 * test-designer が設計したテストケースを Playwright に落とし込んだもの。
 *   → 要件サンプル/ログイン機能_テスト設計.xlsx の「テストケース」シート参照
 *
 * 対象アプリ: playwright-sample/public/index.html（playwright.config.ts の
 * webServer 設定により、テスト実行時に自動で起動・停止する）。
 *
 * 【前提P1】アカウントロックは「連続3回の失敗」で発動する（index.html に実装済み）。
 * 【前提P2】ログイン成功で失敗カウントはリセットされる。
 * ※ これらは要件未確定のため仮置き。要件が確定したら見直すこと。
 */

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'password123';
const WRONG_PASSWORD = 'wrong-pass';

test.describe('ログイン機能 T-01〜T-04', () => {

  // ── T-01: 正常ログイン ─────────────────────────────
  test('T-01 正しい資格情報でログインできる', async ({ page }) => {
    const loginPage = new LoginPage(page);   // Page Object を用意
    await loginPage.goto();                   // トップページを開く
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);  // メール/PW入力→ログイン
    await loginPage.expectLoggedIn(VALID_EMAIL);         // マイページ遷移を確認
  });

  // ── T-02: 2回失敗した後でも、正しい資格情報ならログインできる ──
  //    （失敗カウントが成功でリセットされる想定 = 前提P2の確認）
  test('T-02 失敗2回のあと正しい資格情報でログインできる', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // わざと2回失敗させる
    for (let i = 0; i < 2; i++) {
      await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);
      await loginPage.expectLoginError();     // 毎回エラーが出ること
    }

    // 3回目は正しいPW → 成功するはず
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await loginPage.expectLoggedIn(VALID_EMAIL);
  });

  // ── T-03: 境界値 — 2回目の失敗ではまだロックされない ──────
  test('T-03 [境界] 2回目の失敗ではロックされない', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);  // 1回目
    await loginPage.expectLoginError();
    await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);  // 2回目
    await loginPage.expectLoginError();

    // まだ「ロック」メッセージは出ていない = 通常の認証エラーのままであること
    await expect(page.getByText('ロックされ')).toHaveCount(0);
  });

  // ── T-04: 境界値 — 3回目の失敗でロックされる ───────────
  //    ロック機能を index.html に実装したので、通常の test() で GREEN になる。
  test('T-04 [境界] 3回目の失敗でアカウントがロックされる', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    for (let i = 0; i < 3; i++) {
      await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);  // 3回連続で失敗
    }

    // 3回目でロックメッセージが表示されること
    await expect(page.getByText('ロックされています')).toBeVisible();
  });
});
