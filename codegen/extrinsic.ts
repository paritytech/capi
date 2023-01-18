import { Ty, TyVisitor } from "../scale_info/mod.ts"
import { Codegen, File } from "./mod.ts"
import { getRawCodecPath, S } from "./utils.ts"

export function extrinsicInfo(ctx: Codegen): ExtrinsicInfo {
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

export function extrinsic(ctx: Codegen, { callTy, addressTy, signatureTy }: ExtrinsicInfo) {
  const isUnitVisitor = new TyVisitor<boolean>(ctx.metadata.tys, {
    unitStruct: () => true,
    wrapperStruct(_, inner) {
      return this.visit(inner)
    },
    tupleStruct: () => false,
    objectStruct: () => false,
    option: () => false,
    result: () => false,
    never: () => false,
    stringUnion: () => false,
    taggedUnion: () => false,
    array: () => false,
    sizedArray: () => false,
    primitive: () => false,
    compact: () => false,
    bitSequence: () => false,
    lenPrefixedWrapper: () => false,
    circular: () => false,
  })

  const file = new File()
  const { version, signedExtensions } = ctx.metadata.extrinsic
  const fields = S.object(
    ["version", `${version}`],
    ["extras", getExtrasCodec(signedExtensions.map((x) => [x.ident, x.ty]))],
    [
      "additional",
      getExtrasCodec(signedExtensions.map((x) => [x.ident, x.additionalSigned])),
    ],
    ["call", getRawCodecPath(callTy)],
    ["address", getRawCodecPath(addressTy)],
    ["signature", getRawCodecPath(signatureTy)],
  )
  file.codeRaw = `
    import { $ } from "./capi.ts"
    import * as C from "./capi.ts"
    import { client } from "./client/mod.ts"
    import * as codecs from "./codecs.ts"
    import type * as types from "./types/mod.ts"

    // TODO: use this
    const _extrinsic = ${fields}

    export const extrinsic = C.extrinsic<typeof client, ${ctx.typeVisitor.visit(callTy!)}>(client);
  `
  return file

  function getExtrasCodec(xs: [string, Ty][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => getRawCodecPath(x[1])),
    )
  }
}
