import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// テスト対象アカウント（サンプルアプリ側のダミー認証情報）
const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'password123';

test.describe('ログイン機能', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('正しい認証情報でログインできる', async () => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await loginPage.expectLoggedIn(VALID_EMAIL);
  });

  test('パスワードが誤っている場合はエラーが表示される', async () => {
    await loginPage.login(VALID_EMAIL, 'wrong-password');
    await loginPage.expectLoginError();
  });

  test('未入力のままログインするとエラーが表示される', async () => {
    await loginPage.login('nobody@example.com', 'nope');
    await loginPage.expectLoginError();
  });

  test('ログイン後にログアウトするとログイン画面に戻る', async ({ page }) => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await loginPage.expectLoggedIn(VALID_EMAIL);

    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
