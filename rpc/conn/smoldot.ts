import { start } from "../../deps/smoldot.ts"
import { Client, ClientOptions } from "../../deps/smoldot/client.d.ts"
import { deferred } from "../../deps/std/async.ts"
import { RpcEgressMessage, RpcMessageId } from "../messages.ts"
import { RpcConn } from "./base.ts"

// TODO: fix the many possible race conditions

export interface SmoldotDiscovery {
  relayChainSpec: string
  parachainSpec?: string
}

let client: undefined | Client

export class SmoldotRpcConn extends RpcConn {
  chainPending
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
      this.chainPending = (async () => {
        return client.addChain({
          chainSpec: parachainSpec,
          potentialRelayChains: [await relayChain],
        })
      })()
    } else {
      this.chainPending = client.addChain({ chainSpec: discovery.relayChainSpec })
    }
    this.listening = deferred<void>()
    this.stopListening = () => this.listening.resolve()
    this.startListening()
  }

  async startListening() {
    const inner = await this.chainPending
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
    ;(await this.chainPending).remove()
  }

  async send(id: RpcMessageId, method: string, params: unknown[]) {
    ;(await this.chainPending).sendJsonRpc(RpcEgressMessage.fmt(id, method, params))
  }

  async ready() {
    await this.chainPending
  }
}
