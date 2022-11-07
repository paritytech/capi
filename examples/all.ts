// This script runs all examples in sequence. We should ultimately delete this script...
// ... but it's currently proving useful for reproducing the RPC error pasted below.
// Note, this error doesn't occur if we run this file via the following command:
//
//     `deno task run test_ctx.ts deno task run examples/all.ts`
//
// This leads me to think it's likely an issue with `test_util/local.ts` and its
// (currently) sloppy spawning of Polkadot dev chains.

const ignore = ["all.ts", (await Deno.readTextFile("examples/.ignore")).split("\n")];
for await (const item of Deno.readDir("examples")) {
  if (item.isFile && item.name.endsWith(".ts") && !ignore.includes(item.name)) {
    await import(`./${item.name}`);
  }
}

// error: Uncaught TypeError: this.pendingSubscriptions[id] is not a function
//         this.pendingSubscriptions[id]!(e);
//                                      ^
//     at Object.Client.#listener (file:///Users/harrysolovay/Desktop/capi/rpc/client.ts:45:38)
//     at ProviderConnection.forEachListener (file:///Users/harrysolovay/Desktop/capi/rpc/provider/base.ts:64:7)
//     at WebSocket.<anonymous> (file:///Users/harrysolovay/Desktop/capi/rpc/provider/proxy.ts:50:13)
//     at innerInvokeEventListeners (deno:ext/web/02_event.js:755:9)
//     at invokeEventListeners (deno:ext/web/02_event.js:795:7)
//     at dispatch (deno:ext/web/02_event.js:664:11)
//     at WebSocket.dispatchEvent (deno:ext/web/02_event.js:1043:14)
//     at deno:ext/websocket/01_websocket.js:271:16
