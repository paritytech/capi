// BUG:
// PUPPETEER_PRODUCT=chrome deno run -A --unstable puppeteer_deno.ts
// Uncaught PermissionDenied: Permission denied (os error 13)
// https://github.com/lucacasonato/deno-puppeteer/issues/72

import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"
// import puppeteer from "npm:puppeteer"

const browser = await puppeteer.launch()
const testA = await browser.newPage()
const testB = await browser.newPage()

await testA.goto("http://localhost:8000/derived.html")
await testB.goto("http://localhost:8000/derived2.html")

await new Promise((r) => setTimeout(r, 7000))

await browser.close()
