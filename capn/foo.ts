import { config } from "../capi.config.ts"
import { processConfig } from "./mod.ts"

processConfig(config)

// await withSignal(async (signal) => {
//   // serve(handler(new FsCache("target/capn", signal), new InMemoryCache(signal)), {
//   //   // signal,
//   //   port: 4646,
//   // })
//   // await portReady(4646)

//   const server = "https://capi.dev/@capn/"

//   const metadata = await getBinaryMetadata(
//     {
//       binary: binary("polkadot", "v0.9.40"),
//       chain: "polkadot-dev",
//     },
//     signal,
//   )

//   const metadataHash = await uploadMetadata(server, metadata)

//   const codegenSpec: CodegenSpec = {
//     type: "v0",
//     codegen: new Map([
//       [["polkadot-dev"], {
//         type: "frame",
//         metadata: metadataHash,
//         chainName: "PolkadotDev",
//         connection: {
//           type: "none",
//         },
//       }],
//     ]),
//   }

//   const codegenSpecHash = await uploadCodegenSpec(server, codegenSpec)

//   const url = new URL(`${codegenSpecHash}/polkadot-dev/mod.js`, server).toString()
//   console.log(url)
//   console.log(await fetch(url).then((r) => r.text()))
// })
