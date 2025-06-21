const { Builder, By, until } = require('selenium-webdriver');

async function logoutTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Acessar a página local
    await driver.get('http://127.0.0.1:5500/front-end/index.html');

    // Esperar até o botão com texto "Logout" estar visível
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Logout']")), 5000);

    // Clicar no botão
    const logoutButton = await driver.findElement(By.xpath("//*[text()='Logout']"));
    await logoutButton.click();

    await driver.sleep(1000);

    const criarContaLink = await driver.wait(
      until.elementLocated(By.className('btn-registo')),
      5000
    );
    await criarContaLink.click();


    await driver.sleep(1000);

    const inputNome = await driver.findElement(By.id('rName'));
    await inputNome.sendKeys('exemplo');
    const inputEmail = await driver.findElement(By.id('rEmail'));
    await inputEmail.sendKeys('exemplo@gmail.com');
    const inputPassword = await driver.findElement(By.id('rPass'));
    await inputPassword.sendKeys('exemplo123');
    const selectElement = await driver.findElement(By.id('rEscola_Id'));
    const option = await selectElement.findElement(By.css('option[value="1"]'));
    await option.click();

    const registBtn = await driver.findElement(By.className('btn-enviar'));
    await registBtn.click();

    await driver.sleep(1000);

    console.log('✅ Logout clicado com sucesso.');
  } catch (error) {
    console.error('❌ Erro durante o teste de logout:', error);
  } finally {
    await driver.quit();
  }
}

logoutTest();
