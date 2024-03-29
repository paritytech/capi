const CAPI_MARKER = Symbol.for("paritytech/capi")
if (CAPI_MARKER in globalThis) {
  console.warn("Multiple instances of Capi loaded -- this will lead to unexpected behavior!")
}
;(globalThis as any)[CAPI_MARKER] = true

export * as $ from "./deps/scale.ts"
export { BitSequence } from "./deps/scale.ts"
export * from "./server/client/createDevUsers.ts"
export * from "./server/client/detectConnect.ts"

// moderate --exclude main.ts nets.ts util server nets

export * from "./crypto/mod.ts"
export * from "./fluent/mod.ts"
export * from "./frame_metadata/mod.ts"
export * from "./rpc/mod.ts"
export * from "./rune/mod.ts"
export * from "./scale_info/mod.ts"
