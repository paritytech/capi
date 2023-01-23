import { runBrowserTests } from "./browser.ts"
import { runGenerateTests } from "./generate.ts"
import { startServer, stopServer } from "./server.ts"

// hint: deno run -A --unstable _tasks/test_browser/main.ts examples/derived.ts

// TODO: Handle parallel / all tests cases
// [✓] - deno task test:browser examples/derived.ts # one example
// [ ] - deno task test:browser examples/derived.ts examples/derived.ts # two examples, parallel
// [ ] - deno task test:browser # all examples, parallel

await runGenerateTests()
startServer()
const { testError } = await runBrowserTests()
stopServer()

// CI
if (testError) throw testError
