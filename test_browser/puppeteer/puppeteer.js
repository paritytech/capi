const puppeteer = require('puppeteer')

// TODO: Make Dynamic (generatePuppeteerJS())
const TO_TESTS = ["derived", "derived2"]

;(async () => {
  const browser = await puppeteer.launch();
  const finishTests = await browser.newPage();

  const testA = await browser.newPage();
  const testB = await browser.newPage();

  await testA.goto(`http://localhost:8000/${TO_TESTS[0]}.html`);
  await testB.goto(`http://localhost:8000/${TO_TESTS[1]}.html`);

  // Timeout to fetch POST on test pages
  await new Promise(r => setTimeout(r, 7000));

  try {
    await finishTests.goto('http://localhost:8000/end_of_tests');
  } catch (_err) {
    console.log('All tests finished. Served closed.')
  }

  await browser.close()
})()
