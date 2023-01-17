import { Ty } from "../../scale_info/mod.ts"
import { File } from "../File.ts"
import { FrameCodegen } from "./mod.ts"

export function extrinsicInfo(ctx: FrameCodegen): ExtrinsicInfo {
  const { signature: signatureTy, call: callTy, address: addressTy } = Object.fromEntries(
    ctx.metadata.extrinsic.ty.params.map((x) => [x.name.toLowerCase(), x.ty]),
  )
  return { signatureTy, callTy, addressTy } as ExtrinsicInfo
}
export interface ExtrinsicInfo {
  signatureTy: Ty
  callTy: Ty
  addressTy: Ty
}

export function extrinsic(ctx: FrameCodegen, { callTy }: ExtrinsicInfo) {
  return new File(`
    import { $ } from "./capi.ts"
    import * as C from "./capi.ts"
    import { client } from "./client/mod.ts"
    import * as codecs from "./codecs.ts"
    import type * as types from "./types/mod.ts"

    // export const extrinsic = C.extrinsic<typeof client, ${
    ctx.typeVisitor.visit(callTy!)
  }>(client);
  `)
}
