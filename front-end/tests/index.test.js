import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function main() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()) // Add `.headless()` here for headless mode
    .build();

  try {
    // Step 1: Open the local site
    await driver.get('http://localhost:5500/front-end/plano-atividades.html');

    // Helper: Scroll down and then up
    async function scrollDownUp() {
      const scrollPause = 1000;

      for (let i = 0; i < 3; i++) {
        await driver.executeScript('window.scrollBy(0, 500);');
        await driver.sleep(scrollPause);
      }

      for (let i = 0; i < 3; i++) {
        await driver.executeScript('window.scrollBy(0, -500);');
        await driver.sleep(scrollPause);
      }
    }

    // Step 2: Navigate through anchors

    // Click "Dashboard"
    const dashboardAnchor = await driver.wait(
      until.elementLocated(By.linkText('Dashboard')),
      5000
    );
    console.log("➡️ Switching to Dashboard");
    await dashboardAnchor.click();
    await driver.sleep(1000);
    await scrollDownUp();

    // Click "Plano de Atividades"
    const planoAnchor = await driver.wait(
      until.elementLocated(By.linkText('Plano de Atividades')),
      5000
    );
    console.log("➡️ Switching to Plano de Atividades");
    await planoAnchor.click();
    await driver.sleep(1000);

    // Click "About"
    const aboutAnchor = await driver.wait(
      until.elementLocated(By.linkText('About')),
      5000
    );
    console.log("➡️ Switching to About");
    await aboutAnchor.click();
    await driver.sleep(1000);
    await scrollDownUp();

    console.log('✅ The test passed');
  } catch (err) {
    console.error('❌ The test failed');
    console.error(err); 
  } finally {
    await driver.quit();
  }
}

main();
