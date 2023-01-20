const puppeteer = require('puppeteer')

// TODO: Make Dynamic (generatePuppeteerJS())

let isFailed = false

;(async () => {
  const browser = await puppeteer.launch();
  const finishTests = await browser.newPage();

  const derived = await browser.newPage();
  await derived.goto(`http://localhost:8000/derived.html`);
  checkTest(derived)

  const derived2 = await browser.newPage();
  await derived2.goto(`http://localhost:8000/derived2.html`);
  checkTest(derived2)

  // Delay to fetch CAPI results
  await new Promise(r => setTimeout(r, 7000));

  try { await finishTests.goto('http://localhost:8000/end_of_tests')} catch (_err) {}

  await browser.close()

  // Handle CI failing
  if(isFailed) throw Error("Browser tests failed.")
})()

function checkTest(testPage) {
  testPage.on("pageerror", function(err) {
      console.error(`test FAILED ... \n ${err.toString()}`)
      isFailed = true
  })

  testPage.on('console', msg => {
    if (msg.type() === 'info') console.log(`test ${msg.text()} ... ok`)
  })
}
