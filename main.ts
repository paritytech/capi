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
  const v = detectVersion()
  if (v) return v
  return new TextDecoder().decode(
    new Deno.Command("git", { args: ["rev-parse", "HEAD"] }).outputSync().stdout,
  ).slice(0, 8) || "unknown"
}
