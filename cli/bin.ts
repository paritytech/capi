import { download } from "../deps/capi_binary_builds.ts"

export default async function(binary: string, version: string, ...args: string[]) {
  if (!binary || !version) throw new Error("Must specify binary and version")

  const binaryPath = await download(binary, version)

  const status = await new Deno.Command(binaryPath, {
    args,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }).spawn().status

  Deno.exit(status.code)
}
