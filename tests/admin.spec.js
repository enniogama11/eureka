const { test } = require('@playwright/test');

test('admin add and save product flow', async ({ page }) => {
  const baseUrl = process.env.EUREKA_TEST_URL || 'http://127.0.0.1:8080';
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));

  await page.goto(`${baseUrl}/admin-login.php`);
  await page.fill('#username', 'admin');
  await page.fill('#password', 'eureka2024');
  await page.click('button.login-button');
  await page.waitForURL('**/admin.php');
  await page.waitForTimeout(500);

  await page.click('button:has-text("Adicionar Novo Produto")');
  await page.waitForTimeout(300);
  await page.fill('#productName', 'Teste Produto');
  await page.fill('#productPrice', '4500');
  await page.fill('#productDescription', 'Descrição teste');
  await page.fill('#productImage', 'https://example.com/test.jpg');
  await page.click('button:has-text("Salvar")');
  await page.waitForTimeout(800);

  console.log('BODY_AFTER_SAVE=', (await page.locator('body').innerText()).slice(0, 5000));
});
