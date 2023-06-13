import "./deps/shims/register.ts"
import { bin } from "./cli/bin.ts"
import { serve } from "./cli/serve.ts"
import { sync } from "./cli/sync.ts"
import { Command } from "./deps/cliffy.ts"
import { detectVersion } from "./server/detectVersion.ts"

new Command()
  .name("capi")
  .version(() => detectVersion() ?? "unknown")
  .description("Capi is a framework for crafting interactions with Substrate chains")
  .command("bin", bin)
  .command("sync", sync)
  .command("serve", serve)
  .parse(Deno.args)
