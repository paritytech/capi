import { outdent } from "../deps/outdent.ts"
import { Ty, TyVisitor } from "../scale_info/mod.ts"
import { CodegenCtx, File } from "./Ctx.ts"
import { getRawCodecPath, S } from "./utils.ts"

export function extrinsic(ctx: CodegenCtx) {
  const { tys, extrinsic } = ctx.metadata
  const {
    signature: signatureTy,
    call: callTy,
    address: addressTy,
  } = Object.fromEntries(
    extrinsic.ty.params.map((x) => [x.name.toLowerCase(), x.ty]),
  )

  const isUnitVisitor = new TyVisitor<boolean>(tys, {
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
  const fields = S.object(
    ["version", `${extrinsic.version}`],
    ["extras", getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))],
    [
      "additional",
      getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned])),
    ],
    ["call", getRawCodecPath(callTy!)],
    ["address", getRawCodecPath(addressTy!)],
    ["signature", getRawCodecPath(signatureTy!)],
  )
  file.code = outdent`
    import { $ } from "./capi.ts"
    import * as C from "./capi.ts"
    import { client } from "./client.ts"
    import * as codecs from "./codecs.ts"
    import type * as types from "../types/mod.ts"

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
