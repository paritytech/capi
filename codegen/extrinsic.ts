import { Metadata } from "../frame_metadata/mod.ts"
import { Ty, TyVisitor } from "../scale_info/mod.ts"
import { Files } from "./Files.ts"
import { getRawCodecPath, S } from "./utils.ts"

export function genMetadata(
  metadata: Metadata,
  typeVisitor: TyVisitor<string>,
  files: Files,
) {
  const { tys, extrinsic } = metadata
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

  files.set(
    "_/extrinsic.ts",
    `
import { $, C, client } from "./capi.ts"
import * as codecs from "./codecs.ts"
import type * as types from "./types/mod.ts"

const _extrinsic = ${
      S.object(
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
    }
export const extrinsic = C.extrinsic<typeof client, ${typeVisitor.visit(callTy!)}>(client);
`,
  )

  function getExtrasCodec(xs: [string, Ty][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => getRawCodecPath(x[1])),
    )
  }
}
