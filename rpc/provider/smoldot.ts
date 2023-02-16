import { start } from "../../deps/smoldot.ts"
import { Chain, Client, ClientOptions } from "../../deps/smoldot/client.d.ts"
import { deferred } from "../../deps/std/async.ts"
import { RpcEgressMessage, RpcMessageId } from "../messages.ts"
import { RpcConn, RpcProvider } from "./base.ts"

// TODO: fix the many possible race conditions

export interface SmoldotDiscovery {
  relayChainSpec: string
  parachainSpec?: string
}

export const smoldotRpcProvider = new RpcProvider((discovery: SmoldotDiscovery) =>
  new SmoldotRpcConn(discovery)
)

let client: undefined | Client

export class SmoldotRpcConn extends RpcConn<Promise<Chain>> {
  inner
  listening
  stopListening

  constructor(readonly discovery: SmoldotDiscovery) {
    super()
    if (!client) {
      client = start({
        forbidTcp: true,
        forbidNonLocalWs: true,
        cpuRateLimit: .25,
      } as ClientOptions)
    }
    if (discovery.parachainSpec) {
      const { parachainSpec } = discovery
      const relayChain = client.addChain({
        chainSpec: discovery.relayChainSpec,
        disableJsonRpc: true,
      })
      this.inner = (async () => {
        return client.addChain({
          chainSpec: parachainSpec,
          potentialRelayChains: [await relayChain],
        })
      })()
    } else {
      this.inner = client.addChain({ chainSpec: discovery.relayChainSpec })
    }
    this.listening = deferred<void>()
    this.stopListening = () => this.listening.resolve()
    this.startListening()
  }

  async startListening() {
    const inner = await this.inner
    while (true) {
      try {
        const response = await Promise.race([
          this.listening,
          inner.nextJsonRpcResponse(),
        ])
        if (!response) break
        const message = JSON.parse(response)
        for (const reference of this.references.keys()) reference(message)
      } catch (_e) {}
    }
  }

  async close() {
    this.stopListening()
    ;(await this.inner).remove()
  }

  async send(id: RpcMessageId, method: string, params: unknown[]) {
    const inner = await this.inner
    const message: RpcEgressMessage = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    }
    inner.sendJsonRpc(JSON.stringify(message))
  }

  async ready() {
    await this.inner
  }
}
