import "./deps/shims/register.ts"
import { bin } from "./cli/bin.ts"
import { serve } from "./cli/serve.ts"
import { sync } from "./cli/sync.ts"
import { Command } from "./deps/cliffy.ts"
import { detectVersion } from "./server/detectVersion.ts"

await new Command()
  .name("capi")
  .version(version)
  .description("Capi is a framework for crafting interactions with Substrate chains")
  .command("bin", bin)
  .command("sync", sync)
  .command("serve", serve)
  .parse(Deno.args)

function version() {
  try {
    return detectVersion()
  } catch (_e) {
    return new TextDecoder().decode(
      new Deno.Command("git", { args: ["branch", "--show-current"] }).outputSync().stdout,
    ) || "unknown"
  }
}
