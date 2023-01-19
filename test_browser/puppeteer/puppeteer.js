const puppeteer = require('puppeteer')

// TODO: Make Dynamic (generatePuppeteerJS())

;(async () => {
  const browser = await puppeteer.launch();
  const finishTests = await browser.newPage();

  const testA = await browser.newPage();
  const testB = await browser.newPage();

  await testA.goto(`http://localhost:8000/derived.html`);
  await testB.goto(`http://localhost:8000/derived2.html`);

  // Timeout to fetch POST on test pages
  await new Promise(r => setTimeout(r, 7000));

  try {
    await finishTests.goto('http://localhost:8000/end_of_tests');
  } catch (_err) {
    console.log('Server closed.')
  }

  await browser.close()
})()
