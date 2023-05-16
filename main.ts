import "./deps/shims/register.ts"
import { Command } from "./deps/cliffy.ts"

import { bin } from "./cli/bin.ts"
import { serve } from "./cli/serve.ts"
import { sync } from "./cli/sync.ts"

await new Command()
  .name("capi")
  .description("Capi is a framework for crafting interactions with Substrate chains")
  .command("bin", bin)
  .command("sync", sync)
  .command("serve", serve)
  .parse(Deno.args)
