import { config } from "../capi.config.ts"
import { serve } from "../deps/std/http.ts"
import { assertRejects } from "../deps/std/testing/asserts.ts"
import { handler } from "../server/handler.ts"
import { InMemoryCache } from "../util/cache/memory.ts"
import { withSignal } from "../util/withSignal.ts"
import { $api } from "./api.ts"
import { connectScald, ScaldError, serveScald, WsConnection } from "./scald.ts"
import { createApi } from "./server.ts"

const signal = new AbortController().signal
serve(handler(new InMemoryCache(signal), new InMemoryCache(signal)), { port: 4646 })

// await withSignal(async (signal) => {
//   const _api = createApi(config, signal)

//   serve((request) => {
//     const { response, socket } = Deno.upgradeWebSocket(request)
//     serveScald($api, _api, new WsConnection(socket, signal), signal)
//     return response
//   }, { port: 4646, signal })

//   const api = await connectScald(
//     $api,
//     new WsConnection(new WebSocket("ws://localhost:4646"), signal),
//     signal,
//   )

//   const polkadotDev = (await api.getNetwork("rococoDev")).get("statemine")!
//   console.log(polkadotDev)

//   console.log(await polkadotDev.nextUsers(10))
//   console.log(await polkadotDev.nextUsers(10))
//   console.log(await polkadotDev.nextUsers(10))
//   await assertRejects(() => polkadotDev.nextUsers(10000000000), ScaldError)
// })
