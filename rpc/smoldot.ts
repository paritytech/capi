import { start } from "../deps/smoldot.ts"
import { Client, ClientOptions } from "../deps/smoldot/client.d.ts"
import { deferred } from "../deps/std/async.ts"
import { Connection } from "./Connection.ts"
import { RpcEgressMessage, RpcMessageId } from "./rpc_common.ts"

// TODO: fix the many possible race conditions

export interface SmoldotRpcConnProps {
  relayChainSpec: string
  parachainSpec?: string
}

let client: undefined | Client

export class SmoldotConnection extends Connection {
  chainPending
  listening
  stopListening

  constructor(readonly props: SmoldotRpcConnProps) {
    super()
    if (!client) {
      client = start({
        forbidTcp: true,
        forbidNonLocalWs: true,
        cpuRateLimit: .25,
      } as ClientOptions)
    }
    if (props.parachainSpec) {
      const relayChain = client.addChain({
        chainSpec: props.relayChainSpec,
        disableJsonRpc: true,
      })
      const { parachainSpec } = props
      this.chainPending = (async () => {
        return client.addChain({
          chainSpec: parachainSpec,
          potentialRelayChains: [await relayChain],
        })
      })()
    } else this.chainPending = client.addChain({ chainSpec: props.relayChainSpec })
    this.listening = deferred<void>()
    this.stopListening = () => this.listening.resolve()
    this.startListening()
  }

  async startListening() {
    const chain = await this.chainPending
    while (true) {
      try {
        const response = await Promise.race([
          this.listening,
          chain.nextJsonRpcResponse(),
        ])
        if (!response) break
        this.handle(JSON.parse(response))
      } catch (_e) {}
    }
  }

  async ready() {
    await this.chainPending
  }

  send(id: RpcMessageId, method: string, params: unknown[]) {
    this.chainPending
      .then((chain) => chain.sendJsonRpc(RpcEgressMessage.fmt(id, method, params)))
  }

  close() {
    this.stopListening()
    this.chainPending.then((chain) => chain.remove())
  }
}
