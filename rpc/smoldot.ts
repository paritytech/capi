import { Client, ClientOptions, start } from "../deps/smoldot.ts"
import { deferred } from "../deps/std/async.ts"
import { Connection } from "./Connection.ts"
import { RpcEgressMessage } from "./rpc_messages.ts"

// TODO: fix the many possible race conditions

export interface SmoldotRpcConnProps {
  relayChainSpec: string
  parachainSpec?: string
  maxLogLevel?: number
}

let client: undefined | Client
let count = 0

export class SmoldotConnection extends Connection {
  // private so that the types don't need to be referenced when packaged
  private smoldotChainPending
  listening
  stopListening

  constructor(readonly props: SmoldotRpcConnProps) {
    super()
    count++
    if (!client) {
      client = start({
        forbidTcp: true,
        forbidNonLocalWs: true,
        cpuRateLimit: .25,
        maxLogLevel: props.maxLogLevel,
      } as ClientOptions)
    }
    if (props.parachainSpec) {
      const relayChain = client.addChain({
        chainSpec: props.relayChainSpec,
        disableJsonRpc: true,
      })
      const { parachainSpec } = props
      this.smoldotChainPending = (async () => {
        return client.addChain({
          chainSpec: parachainSpec,
          potentialRelayChains: [await relayChain],
        })
      })()
    } else this.smoldotChainPending = client.addChain({ chainSpec: props.relayChainSpec })
    this.listening = deferred<void>()
    this.stopListening = () => this.listening.resolve()
    this.startListening()
  }

  async startListening() {
    const chain = await this.smoldotChainPending
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
    await this.smoldotChainPending
  }

  send(id: number, method: string, params: unknown[]) {
    this.smoldotChainPending
      .then((chain) => chain.sendJsonRpc(RpcEgressMessage.fmt(id, method, params)))
  }

  close() {
    this.stopListening()
    this.smoldotChainPending.then((chain) => {
      count--
      chain.remove()
      if (!count) {
        client?.terminate()
        client = undefined
      }
    })
  }
}
