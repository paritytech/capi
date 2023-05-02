import { CapiBinary } from "../deps/capi_binary_builds.ts"

export default async function(
  binary: string,
  version: string,
  ...args: string[]
) {
  if (!binary || !version) throw new Error("Must specify binary and version")

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
}
