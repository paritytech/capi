// TODO
export {};

// import { start } from "../../deps/smoldot.ts";
// import { Chain, Client } from "../../deps/smoldot/client.d.ts";
// import * as msg from "../messages.ts";
// import { Provider, ProviderConnection } from "./base.ts";

// let client: undefined | Client;
// const connections = new Map<string, Connection>();
// type Connection = ProviderConnection<Chain, Listener>;
// type Listener = (messageRaw: string) => void;

// export interface SmoldotProvider extends Provider<string, never, never, never> {}

// export const smoldotProvider: SmoldotProvider = (chainSpec, handler) => {
//   const listener = (message: string) => {
//     handler(msg.parse(message));
//   };
//   return {
//     send: async (message) => {
//       const conn = await connection(chainSpec, listener);
//       conn.inner.sendJsonRpc(JSON.stringify(message));
//     },
//     release: async () => {
//       const conn = connections.get(chainSpec)!;
//       conn.listeners.delete(listener);
//       if (!conn.listeners.size) {
//         conn.inner.remove();
//         connections.delete(chainSpec);
//         if (!connections.size) {
//           await client!.terminate();
//         }
//       }
//     },
//   };
// };

// async function connection(chainSpec: string, listener: Listener): Promise<Connection> {
//   if (!client) {
//     client = start({/* TODO */});
//   }
//   let connection = connections.get(chainSpec);
//   if (!connection) {
//     const inner = await client.addChain({ chainSpec });
//     connection = {
//       inner,
//       listeners: new Set([listener]),
//     };
//     connections.set(chainSpec, connection);
//     const loop = async () => {
//       const message = await inner.nextJsonRpcResponse();
//       if (connection) {
//         for (const listener of connection.listeners) {
//           listener(message);
//         }
//         await loop();
//       }
//     };
//     loop();
//     loop();
//     loop();
//   } else if (!connection.listeners.has(listener)) {
//     connection.listeners.add(listener);
//   }
//   return connection;
// }
