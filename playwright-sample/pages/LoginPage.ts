import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model（POM）の例。
 * 画面ごとに「要素」と「操作」を1クラスにまとめることで、
 * テスト本体を読みやすく、UI変更に強くする。
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly welcomeText: Locator;

  constructor(page: Page) {
    this.page = page;
    // ロケーターは role / label ベースを優先（DOM構造の変更に強い）
    this.emailInput = page.getByLabel('メールアドレス');
    this.passwordInput = page.getByLabel('パスワード');
    this.loginButton = page.getByRole('button', { name: 'ログイン' });
    this.errorMessage = page.getByRole('alert');
    this.welcomeText = page.getByTestId('welcome');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn(email: string) {
    await expect(this.welcomeText).toContainText(email);
    await expect(this.page).toHaveURL(/.*dashboard/);
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
