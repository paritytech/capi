import { parse } from "../deps/std/flags.ts"
import { assert } from "../deps/std/testing/asserts.ts"
import * as common from "./common.ts"

const { ["--"]: cmd } = parse(Deno.args, { "--": true })
assert(cmd.length)

const processContainers: Partial<Record<common.RuntimeName, ProcessContainer>> = {}
interface ProcessContainer {
  port: number
  process: Deno.Process
}

const listener = Deno.listen({
  transport: "tcp",
  port: 0,
}) as Deno.Listener
const { hostname, port } = listener.addr as Deno.NetAddr
useListener(listener)

const cmdProcess = Deno.run({
  cmd,
  env: {
    TEST_CTX_HOSTNAME: hostname,
    TEST_CTX_PORT: port.toString(),
  },
})

const status = await cmdProcess.status()
listener.close()
for (const { process } of Object.values(processContainers)) {
  process.kill("SIGKILL")
  process.close()
}
Deno.exit(status.code)

async function useListener(listener: Deno.Listener) {
  for await (const conn of listener) {
    useConn(conn)
  }

  async function useConn(conn: Deno.Conn) {
    for await (const e of conn.readable) {
      const e0 = e.at(0)
      if (typeof e0 !== "number") {
        throw new Error()
      }
      const runtimeName = (common.RUNTIME_NAMES as Record<number, common.RuntimeName>)[e0]!
      let processContainer = processContainers[runtimeName]
      if (!processContainer) {
        const port = common.getOpenPort()
        processContainer = {
          port,
          process: common.polkadotProcess(port, runtimeName),
        }
        processContainers[runtimeName] = processContainer
      }
      const message = new Uint8Array(2)
      new DataView(message.buffer).setUint16(0, processContainer.port)
      ;(async () => {
        await common.portReady(processContainer.port)
        conn.write(message)
      })()
    }
  }
}
