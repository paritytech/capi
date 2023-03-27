import { download } from "../deps/capi_binary_builds.ts"

export default async function(
  binary: string,
  version: string,
  dashDash?: string,
  ...args: string[]
) {
  if (!binary || !version) throw new Error("Must specify binary and version")

  const binaryPath = await download(binary, version)

  if (!dashDash) {
    console.log(binaryPath)
    Deno.exit(0)
  }

  if (dashDash !== "--") {
    throw new Error("Arguments to bin must begin with --")
  }

  const child = new Deno.Command(binaryPath, {
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
