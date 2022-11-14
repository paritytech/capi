import type * as types from "./types/mod.ts"

import { C, client } from "./capi.ts"

export * as _metadata from "./_metadata.ts"
export * as pallets from "./pallets/mod.ts"
export * as types from "./types/mod.ts"

export { client }
export const extrinsic = C.extrinsic<typeof client, types.polkadot_runtime.RuntimeCall>(client)
