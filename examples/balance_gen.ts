// import { WebSocketConnectionPool } from "/connection/mod.ts";
// import { Account } from "/examples/.capi/polkadot/System/mod.ts";
// import * as p from "/primitive/mod.ts";
// import * as s from "/system/mod.ts";

// const run = s.Run({ connections: new WebSocketConnectionPool() });

// const pubKey = p.PubKey.Ss58Text(s.lift("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC"));

// const pubKeyBytes = s.then(pubKey)(({ bytes }) => bytes);

// const storageMapValue = Account(pubKeyBytes);

// const result = await run(storageMapValue);

// if (result instanceof Error) {
//   console.log(result);
// } else {
//   console.log(result.value);
// }
