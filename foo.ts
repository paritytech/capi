import { WsConnection } from "./mod.ts"
import { withSignal } from "./util/withSignal.ts"

const result = await withSignal(async (signal) => {
  const connection = WsConnection.connect("wss://rpc.polkadot.io/", signal)
  const response = await connection.call("sync_state_genSyncSpec", [false])
  if (response.error) throw response.error
  return response.result
})

console.log(JSON.stringify(result))
