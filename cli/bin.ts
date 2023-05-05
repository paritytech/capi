import { CapiBinary } from "../deps/capi_binary_builds.ts"
import { Command } from "../deps/cliffy.ts"

export const bin = new Command()
  .description("Executes the <binary>@<version> for the current platform with [args...]")
  .arguments("<binary:string> <version:string> [...args:string]")
  .stopEarly()
  .example("run a polkadot node in dev mode", "capi bin polkadot v0.9.41 --dev")
  .example(
    "build a chain spec for Rococo local",
    "capi bin polkadot v0.9.41 build-spec --chain rococo-local",
  )
  .action(async function(_options, binary: string, version: string, ...args: string[]) {
    const bin = new CapiBinary(binary, version)
    if (!(await bin.exists())) {
      console.error("Downloading", bin.key)
      await bin.download()
    }
    const child = new Deno.Command(bin.path, {
      args,
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    }).spawn()
    for (const signal of ["SIGTERM", "SIGINT"] satisfies Deno.Signal[]) {
      Deno.addSignalListener(signal, () => {
        child.kill(signal)
      })
    }
    Deno.exit((await child.status).code)
  })
