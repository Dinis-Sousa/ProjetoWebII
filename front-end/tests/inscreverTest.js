const { Builder, By, until } = require('selenium-webdriver');

let inscrever = async () => {
    const driver = await new Builder().forBrowser('chrome').build();

    try{
        // Acessar a página local
        await driver.get('http://127.0.0.1:5500/front-end/index.html');

        // Esperar até o botão com texto "Logout" estar visível
        await driver.wait(until.elementLocated(By.xpath("//*[text()='Logout']")), 5000);

        // Clicar no botão
        const logoutButton = await driver.findElement(By.xpath("//*[text()='Logout']"));
        await logoutButton.click();

        await driver.sleep(1000);

        const inputEmail = await driver.findElement(By.id('mymail'));
        await inputEmail.sendKeys('exemplo@gmail.com');
        await driver.sleep(1000);
        const inputPassword = await driver.findElement(By.id('myPass'));
        await driver.sleep(1000);
        await inputPassword.sendKeys('exemplo123');

        const registBtn = await driver.findElement(By.className('btn-enviar'));
        await registBtn.click();

        await driver.sleep(1000);

        await driver.wait(until.elementLocated(By.xpath("//*[text()='Plano de Atividades']")), 5000);
        const planoDeAtividadesBtn = await driver.findElement(By.xpath("//*[text()='Plano de Atividades']"));
        await planoDeAtividadesBtn.click();

        await driver.sleep(1000);

        const inscreverBtn = await driver.findElement(By.id('1'));
        await inscreverBtn.click();

        await driver.sleep(1000);
        console.log('✅ Inscrição realizada com sucesso!.');

    } catch(err){
        console.error('❌ Erro durante a realização da inscricao:', err);
    } finally {
        await driver.quit();
    }
}

inscrever()