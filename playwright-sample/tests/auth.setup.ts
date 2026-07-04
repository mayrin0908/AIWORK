import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

// ログイン状態（cookie / localStorage）を保存するファイル
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * 「setup」プロジェクトとして最初に一度だけ実行される。
 * 実際にログインし、その状態を storageState としてファイルに書き出す。
 * 以降の認証済みテストは、このファイルを読み込むだけでログイン済みになる。
 */
setup('ログインして状態を保存する', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  // 本当にログインできたことを確認してから保存する
  await loginPage.expectLoggedIn('user@example.com');

  // cookie と localStorage をまとめてファイルに保存
  await page.context().storageState({ path: authFile });
});
