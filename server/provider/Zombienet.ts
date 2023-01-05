// TODO
export {}

// import * as Z from "../../deps/zones.ts"
// import * as rpc from "../../rpc/mod.ts"

// export {}

// export const start = async (configFile: string, env?: Record<string, string>) => {
//   const networkFilesPath = await Deno.makeTempDir({ prefix: "capi_zombienet_" })
//   const zombienetBinary = (() => {
//     switch (Deno.build.os) {
//       case "darwin":
//         return "zombienet-macos"
//       case "linux":
//         return "zombienet-linux"
//       default:
//         throw new Error(`zombienet does not support ${Deno.build.os} OS`)
//     }
//   })()
//   const process = Deno.run({
//     cmd: [
//       zombienetBinary,
//       "-d",
//       networkFilesPath,
//       "--provider",
//       "native",
//       "--force",
//       "spawn",
//       configFile,
//     ],
//     stdout: "piped",
//     env,
//   })
//   // TODO: improve Network launched detection
//   // Deno.watchFs on `${networkFilesPath}/zombie.json` could be an alternative
//   const buffer = new Uint8Array(1024)
//   while (true) {
//     await process.stdout?.read(buffer)
//     const text = new TextDecoder().decode(buffer)
//     if (text.includes("Network launched")) {
//       process.stdout.close()
//       break
//     }
//   }
//   const close = async () => {
//     process.kill("SIGINT")
//     await process.status()
//     process.close()
//     Deno.remove(networkFilesPath, { recursive: true })
//   }
//   const config = JSON.parse(await Deno.readTextFile(`${networkFilesPath}/zombie.json`))
//   const clients = {
//     relay: config.relay.map((node: any) => new NodeClientEffect(node.wsUri)) as NodeClientEffect[],
//     paras: Object.entries(config.paras)
//       .reduce(
//         (acc, [name, { nodes }]: any) => {
//           acc[name] = nodes.map((node: any) => new NodeClientEffect(node.wsUri))
//           return acc
//         },
//         {} as Record<string, NodeClientEffect[]>,
//       ),
//     byName: Object.entries(config.nodesByName)
//       .reduce(
//         (acc, [name, node]: any) => {
//           acc[name] = new NodeClientEffect(node.wsUri)
//           return acc
//         },
//         {} as Record<string, NodeClientEffect>,
//       ),
//   }
//   return { close, config, clients }
// }

// export class NodeClientEffect extends Z.Effect<rpc.Client<string, Event, Event, Event>, Error> {
//   constructor(readonly url: string) {
//     super({
//       kind: "Client",
//       impl: Z
//         .call(() => {
//           try {
//             return new rpc.Client(rpc.proxyProvider, url)
//           } catch (e) {
//             return e
//           }
//         })
//         .impl,
//       items: [url],
//       memoize: true,
//     })
//   }
// }
