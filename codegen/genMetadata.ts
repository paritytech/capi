import * as M from "../frame_metadata/mod.ts";
import { Decl, getPath, getRawCodecPath, makeDocComment, S } from "./utils.ts";

export function genMetadata(metadata: M.Metadata, decls: Decl[], codecVisitor: M.TyVisitor<S>) {
  const { tys, extrinsic, pallets } = metadata;

  const isUnitVisitor = new M.TyVisitor<boolean>(tys, {
    unitStruct: () => true,
    wrapperStruct(_, inner) {
      return this.visit(inner);
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
    circular: () => false,
  });

  decls.push({
    path: "_metadata.extrinsic",
    code: [
      "export const extrinsic =",
      S.object(
        ["version", extrinsic.version],
        ["extras", getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))],
        [
          "additional",
          getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned])),
        ],
      ),
    ],
  });
  for (const pallet of pallets) {
    decls.push({
      path: `${pallet.name}.i`,
      code: [`export const i =`, pallet.i],
    });
    for (const key of ["calls", "error", "event"] as const) {
      decls.push({
        path: `${pallet.name}.$${key}`,
        code: [
          `export const $${key} =`,
          pallet[key] ? codecVisitor.visit(pallet[key]!.ty) : "undefined",
        ],
      });
    }
    decls.push({
      path: `${pallet.name}.storagePrefix`,
      code: [
        `export const storagePrefix =`,
        pallet.storage ? S.string(pallet.storage.prefix) : "undefined",
      ],
    });
    for (const entry of pallet.storage?.entries ?? []) {
      decls.push({
        path: `${pallet.name}.${entry.name}`,
        code: [
          makeDocComment(entry.docs),
          `export const ${entry.name} =`,
          S.object(
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
                  ? ["$.tuple(", codecVisitor.visit(entry.key), ")"]
                  : codecVisitor.visit(entry.key)
                : "[]",
            ],
            ["value", codecVisitor.visit(entry.value)],
          ),
        ],
      });
    }
    if (pallet.calls) {
      const ty = tys[pallet.calls.ty]! as M.Ty & M.UnionTyDef;
      const isStringUnion = ty.members.every((x) => !x.fields.length);
      for (const call of ty.members) {
        const typeName = isStringUnion ? S.string(call.name) : getPath(tys, ty)! + "." + call.name;
        const [params, data]: [S, S] = call.fields.length
          ? call.fields[0]!.name
            ? [`value: Omit<${typeName}, "type">`, ["{ ...value, type:", S.string(call.name), "}"]]
            : [[call.fields.length > 1 ? "..." : "", `value: ${typeName}["value"]`], [
              "{ ...value, type:",
              S.string(call.name),
              "}",
            ]]
          : ["", isStringUnion ? S.string(call.name) : S.object(["type", S.string(call.name)])];
        decls.push({
          path: `${pallet.name}.${call.name}`,
          code: [
            makeDocComment(call.docs),
            "export function",
            call.name,
            ["(", params, ")"],
            [":", typeName],
            ["{ return", data, "}"],
          ],
        });
      }
    }
  }

  decls.push({
    path: "_metadata.types",
    code: [
      "export const types: $.AnyCodec[] =",
      S.array(codecVisitor.tys.map((ty) => getRawCodecPath(ty))),
    ],
  });

  function getExtrasCodec(xs: [string, number][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => codecVisitor.visit(x[1])),
    );
  }
}
