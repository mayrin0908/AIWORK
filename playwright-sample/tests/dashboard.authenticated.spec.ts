import { test, expect } from '@playwright/test';

/**
 * このファイルは「authenticated」プロジェクトで実行される。
 * プロジェクト側で storageState（保存済みログイン状態）を読み込むため、
 * ここではログイン操作を一切書かずにダッシュボードから始められる。
 *
 * → ログインが必要な多数のテストで、毎回ログイン手順を踏まずに済み高速になる。
 */
test.describe('認証済み状態のテスト', () => {
  test('ログイン操作なしでダッシュボードに直行できる', async ({ page }) => {
    await page.goto('/');

    // ログインフォームを通らずにダッシュボードが表示される
    await expect(page.getByTestId('welcome')).toContainText('user@example.com');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeHidden();
  });

  test('ダッシュボードにログアウトボタンが表示されている', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
  });
});
