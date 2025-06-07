import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function main() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()) // Add `.headless()` here if you want headless mode
    .build();

  try {
    // Step 1: Open the local site
    await driver.get('http://localhost:5500/front-end/plano-atividades.html');

    // Helper to scroll down and up
    async function scrollDownUp() {
      // Scroll down by 500px
      await driver.executeScript('window.scrollBy(0, 500);');
      await driver.sleep(1000); // wait 2 seconds
      await driver.executeScript('window.scrollBy(0, 500);');
      await driver.sleep(1000); // wait 2 seconds
      await driver.executeScript('window.scrollBy(0, 500);');
      await driver.sleep(1000); // wait 2 seconds

      // Scroll up by 500px
      await driver.executeScript('window.scrollBy(0, -500);');
      await driver.executeScript('window.scrollBy(0, -500);');
      await driver.executeScript('window.scrollBy(0, -500);');
    }

    // Step 2: Navigate through anchors

    // Click "Dashboard"
    const dashboardAnchor = await driver.findElement(By.linkText('Dashboard'));
    console.log("➡️ switching to Dashboard");
    await dashboardAnchor.click();
    await scrollDownUp(); // Await scrolling after click

    // Click "Plano de Atividades"
    const planoAnchor = await driver.findElement(By.linkText('Plano de Atividades'));
    console.log("➡️ switching to Plano de Atividades");
    await planoAnchor.click();
    await driver.sleep(1000);

    // Click "About"
    const aboutAnchor = await driver.findElement(By.linkText('About'));
    console.log("➡️ switching to About");
    await aboutAnchor.click();
    await scrollDownUp();
    
    console.log('✅ The test passed')


  } catch (err){
    console.error('❌ The test failed')
  } finally {
    // Step 3: Quit the browser
    await driver.quit();
  }
}

main();

