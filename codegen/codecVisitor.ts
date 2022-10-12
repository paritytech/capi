import * as M from "../frame_metadata/mod.ts";
import { Decl, Files, getCodecPath, getName, getRawCodecPath, importSource, S } from "./utils.ts";

export function createCodecVisitor(
  tys: M.Ty[],
  decls: Decl[],
  typeVisitor: M.TyVisitor<S>,
  files: Files,
) {
  ["import { $, $null, $era } from", S.string(importSource)];
  const namespaceImports = new Set<string>();
  const codecs: S[] = [];

  files.set("codecs.ts", {
    getContent: () => [
      "\n",
      [
        "import { ChainError, BitSequence, Era, $, $era, $null } from",
        S.string(importSource),
      ],
      [`import type * as t from "./mod.ts"`],
      ...codecs,
      [
        "export const _all: $.AnyCodec[] =",
        S.array(tys.map((ty) => getName(getRawCodecPath(ty)))),
      ],
    ],
  });

  const compactCodecVisitor = new M.TyVisitor<string | null>(tys, {
    unitStruct: () => "$null",
    wrapperStruct(_, inner) {
      return this.visit(inner);
    },
    tupleStruct: () => null,
    objectStruct: () => null,
    option: () => null,
    result: () => null,
    never: () => null,
    stringUnion: () => null,
    taggedUnion: () => null,
    array: () => null,
    sizedArray: () => null,
    primitive: (ty) => {
      const lookup: Partial<Record<typeof ty.kind, string>> = {
        u8: "$.compactU8",
        u16: "$.compactU16",
        u32: "$.compactU32",
        u64: "$.compactU64",
        u128: "$.compactU128",
        u256: "$.compactU256",
      };
      return lookup[ty.kind] ?? null;
    },
    compact: () => null,
    bitSequence: () => null,
    lenPrefixedWrapper: () => null,
    circular: () => null,
  });

  return new M.TyVisitor<S>(tys, {
    unitStruct(ty) {
      return addCodecDecl(ty, "$null");
    },
    wrapperStruct(ty, inner) {
      return addCodecDecl(ty, this.visit(inner));
    },
    tupleStruct(ty, members) {
      return addCodecDecl(ty, ["$.tuple(", members.map((x) => [this.visit(x), ","]), ")"]);
    },
    objectStruct(ty) {
      return addCodecDecl(
        ty,
        [
          "$.object(",
          ty.fields.map(
            (x) => [S.array([S.string(x.name!), this.visit(x.ty)]), ","],
          ),
          ")",
        ],
      );
    },
    option(ty, some) {
      return addCodecDecl(ty, ["$.option(", this.visit(some), ")"]);
    },
    result(ty, ok, err) {
      return addCodecDecl(ty, ["$.result(", this.visit(ok), ",", [
        "$.instance(ChainError<",
        fixType(typeVisitor.visit(err)),
        `>, ["value", `,
        this.visit(err),
        "])",
      ], ")"]);
    },
    never(ty) {
      return addCodecDecl(ty, "$.never");
    },
    stringUnion(ty) {
      return addCodecDecl(ty, [
        "$.stringUnion(",
        S.object(...ty.members.map((x): [S, S] => [x.index, S.string(x.name)])),
        ")",
      ]);
    },
    taggedUnion(ty) {
      return addCodecDecl(
        ty,
        [
          `$.taggedUnion("type",`,
          S.object(
            ...ty.members.map(({ fields, name: type, index }): [S, S] => {
              let props: S[];
              if (fields.length === 0) {
                props = [];
              } else if (fields[0]!.name === undefined) {
                // Tuple variant
                const value = fields.length === 1
                  ? this.visit(fields[0]!.ty)
                  : ["$.tuple(", fields.map((f) => [this.visit(f.ty), ","]), ")"];
                props = [S.array([S.string("value"), value])];
              } else {
                // Object variant
                props = fields.map((field) =>
                  S.array([
                    S.string(field.name!),
                    this.visit(field.ty),
                  ])
                );
              }
              return [index, S.array([S.string(type), ...props])];
            }),
          ),
          ")",
        ],
      );
    },
    uint8Array(ty) {
      return addCodecDecl(ty, "$.uint8Array");
    },
    array(ty) {
      return addCodecDecl(ty, ["$.array(", this.visit(ty.typeParam), ")"]);
    },
    sizedUint8Array(ty) {
      return addCodecDecl(ty, `$.sizedUint8Array(${ty.len})`);
    },
    sizedArray(ty) {
      return addCodecDecl(ty, ["$.sizedArray(", this.visit(ty.typeParam), ",", ty.len, ")"]);
    },
    primitive(ty) {
      return addCodecDecl(ty, getCodecPath(tys, ty)!);
    },
    compact(ty) {
      const result = compactCodecVisitor.visit(ty.typeParam);
      if (result) return addCodecDecl(ty, result);
      throw new Error(
        "Cannot create compact codec for " + S.toString(typeVisitor.visit(ty.typeParam)),
      );
    },
    bitSequence(ty) {
      return addCodecDecl(ty, "$.bitSequence");
    },
    map(ty, key, val) {
      return addCodecDecl(ty, ["$.map(", this.visit(key), ",", this.visit(val), ")"]);
    },
    set(ty, val) {
      return addCodecDecl(ty, ["$.set(", this.visit(val), ")"]);
    },
    era(ty) {
      return addCodecDecl(ty, "$era");
    },
    lenPrefixedWrapper(ty, inner) {
      return addCodecDecl(ty, ["$.lenPrefixed(", this.visit(inner), ")"]);
    },
    circular(ty) {
      return ["$.deferred(() =>", getName(getRawCodecPath(ty)), ")"];
    },
  });

  function addCodecDecl(ty: M.Ty, value: S) {
    const rawPath = getRawCodecPath(ty);
    if (ty.path.length > 1) {
      namespaceImports.add(ty.path[0]!);
    }
    codecs.push([
      ["export const", getName(rawPath)],
      ": $.Codec<",
      fixType(typeVisitor.visit(ty)),
      "> =",
      value,
    ]);
    const path = getCodecPath(tys, ty);
    // Deduplicate -- metadata has redundant entries (e.g. pallet_collective::RawOrigin)
    if (path !== rawPath && path !== value && !decls.some((x) => x.path === path)) {
      decls.push({
        path,
        code: [
          ["export const", getName(path)],
          ": $.Codec<",
          typeVisitor.visit(ty),
          "> =",
          rawPath,
        ],
      });
    }
    return getName(rawPath);
  }

  /**
   * Prefix generated types with `t.`
   * e.g. `[Compact<u8>, foo.Bar, Uint8Array]` -> `[t.Compact<t.u8>, t.foo.Bar, Uint8Array]`
   */
  function fixType(type: S) {
    return S.toString(type).replace(
      // Matches paths (`a.b.c`) that either contain a `.`, or are a number type (either `u123` or `Compact`)
      /\b([\w\$]+\.[\w\.$]+|u\d+|Compact)\b/g,
      (x) => "t." + x,
    );
  }
}
