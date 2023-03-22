import bin from "./cli/bin.ts"
import serve from "./cli/serve.ts"

const commands: Record<string, (...args: string[]) => void> = { bin, serve }

if (Deno.args[0]! in commands) {
  commands[Deno.args[0]!]!(...Deno.args.slice(1))
} else {
<<<<<<< HEAD
  console.log(`Reusing existing Capi server at "${href}"`)
  await onReady()
}

async function onReady() {
  const [bin, ...args] = cmd
  if (bin) {
    const command = new Deno.Command(bin, { args, signal })
    const status = await command.spawn().status
    self.addEventListener("unload", () => Deno.exit(status.code))
    controller.abort()
  }
=======
  serve(...Deno.args)
>>>>>>> 1125916 (use capi-binary-builds to auto-install deps)
}
