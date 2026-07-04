import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * データ駆動テストの例。
 * 「入力の組み合わせ（因子×水準）」を配列で定義し、同じ手順を回す。
 * ケースを増やしたいときは配列に1行足すだけで済む。
 */
type LoginCase = {
  title: string;
  email: string;
  password: string;
  expect: 'success' | 'error';
};

const cases: LoginCase[] = [
  { title: '正常系: 正しいメール・正しいPW', email: 'user@example.com', password: 'password123', expect: 'success' },
  { title: '異常系: 正しいメール・誤ったPW', email: 'user@example.com', password: 'bad', expect: 'error' },
  { title: '異常系: 誤ったメール・正しいPW', email: 'other@example.com', password: 'password123', expect: 'error' },
  { title: '異常系: 両方誤り', email: 'other@example.com', password: 'bad', expect: 'error' },
];

for (const c of cases) {
  test(`ログイン: ${c.title}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(c.email, c.password);

    if (c.expect === 'success') {
      await loginPage.expectLoggedIn(c.email);
    } else {
      await loginPage.expectLoginError();
    }
  });
}
