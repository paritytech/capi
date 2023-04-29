import { Autobin, resolveBinary } from "../devnets/binary.ts"

export default async function(
  binary: string,
  version: string,
  ...args: string[]
) {
  if (!binary || !version) throw new Error("Must specify binary and version")

  const binaryPath = await resolveBinary(new Autobin(binary, version))

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
