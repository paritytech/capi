import { ValueRune } from "capi/mod.ts"

import { client } from "polkadot_dev/mod.ts"

const root = client.metadata().as(ValueRune).unwrapError()

console.log(await root.run())
