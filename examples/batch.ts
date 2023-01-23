import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

import { extrinsic } from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.36/mod.ts"
import {
  Balances,
  Utility,
} from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.36/pallets/mod.ts"
import { collectExtrinsicEvents } from "http://localhost:5646/@local/test_util/extrinsic.ts"

// TODO: uncomment these lines / use env upon solving `count` in zones
// const getBalances = C.Z.ls(
//   ...recipients.map(({ publicKey }) => {
//     return C.entryRead(T.westend)("System", "Account", [publicKey])
//       .access("value").access("data").access("free");
//   }),
// )

const root = collectExtrinsicEvents(
  extrinsic({
    sender: T.dave.address,
    call: Utility.batchAll({
      calls: T.users.map((pair) =>
        Balances.transfer({
          dest: pair.address,
          value: 12345n,
        })
      ),
    }),
  }).signed(T.dave.sign),
).next(console.log)

U.throwIfError(await root.run())
