const { test } = require('@playwright/test');

test('admin add and save product flow', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));

  await page.goto('http://127.0.0.1:4173/admin-login.html');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'eureka2024');
  await page.click('button.login-button');
  await page.waitForTimeout(1500);

  await page.click('button:has-text("Adicionar Novo Produto")');
  await page.waitForTimeout(500);
  await page.fill('#productName', 'Teste Produto');
  await page.fill('#productPrice', '4500');
  await page.fill('#productDescription', 'Descrição teste');
  await page.fill('#productImage', 'https://example.com/test.jpg');
  await page.click('button:has-text("Salvar")');
  await page.waitForTimeout(1000);

  console.log('BODY_AFTER_SAVE=', (await page.locator('body').innerText()).slice(0, 5000));
});
