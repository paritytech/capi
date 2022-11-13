import * as M from "../frame_metadata/mod.ts"
import { Decl, getPath, getRawCodecPath, makeDocComment, S } from "./utils.ts"

export function genMetadata(metadata: M.Metadata, decls: Decl[], typeVisitor: M.TyVisitor<string>) {
  const { tys, extrinsic, pallets } = metadata

  const isUnitVisitor = new M.TyVisitor<boolean>(tys, {
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

  const {
    signature: signatureTy,
    call: callTy,
    address: addressTy,
  } = Object.fromEntries(
    extrinsic.ty.params.map((x) => [x.name.toLowerCase(), x.ty]),
  )

  decls.push({
    path: "_metadata.extrinsic",
    code: "export const extrinsic ="
      + S.object(
        ["version", `${extrinsic.version}`],
        ["extras", getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))],
        [
          "additional",
          getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned])),
        ],
        ["call", getRawCodecPath(callTy!)],
        ["address", getRawCodecPath(addressTy!)],
        ["signature", getRawCodecPath(signatureTy!)],
      ),
  })
  for (const pallet of pallets) {
    for (const entry of pallet.storage?.entries ?? []) {
      decls.push({
        path: `pallets.${pallet.name}.${entry.name}`,
        code: makeDocComment(entry.docs) + `export const ${entry.name} =`
          + S.object(
            ["type", S.string(entry.type)],
            ["modifier", S.string(entry.modifier)],
            [
              "hashers",
              entry.type === "Map" ? JSON.stringify(entry.hashers) : "[]",
            ],
            [
              "key",
              entry.type === "Map"
                ? entry.hashers.length === 1
                  ? `$.tuple(${getRawCodecPath(entry.key)})`
                  : getRawCodecPath(entry.key)
                : "[]",
            ],
            ["value", getRawCodecPath(entry.value)],
          ),
      })
    }
    if (pallet.calls) {
      const ty = pallet.calls as M.Ty & M.UnionTyDef
      const isStringUnion = ty.members.every((x) => !x.fields.length)
      for (const call of ty.members) {
        const typeName = getPath(tys, ty)! + "." + call.name
        const [params, data]: [string, string] = call.fields.length
          ? call.fields[0]!.name
            ? [`value: Omit<${typeName}, "type">`, `{ ...value, type: ${S.string(call.name)} }`]
            : [
              `${call.fields.length > 1 ? "..." : ""}value: ${typeName}["value"]`,
              `{ ...value, type: ${S.string(call.name)} }`,
            ]
          : ["", isStringUnion ? S.string(call.name) : S.object(["type", S.string(call.name)])]
        decls.push({
          path: `pallets.${pallet.name}.${call.name}`,
          code: makeDocComment(call.docs)
            + `export function ${call.name}(${params}): ${typeVisitor.visit(callTy!)}`
            + `{ return { type: ${S.string(pallet.name)}, value: ${data} } }`,
        })
      }
    }
  }

  decls.push({
    path: "_metadata.types",
    code: "export const types = _codec._all",
  })

  function getExtrasCodec(xs: [string, M.Ty][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => getRawCodecPath(x[1])),
    )
  }
}
