import { tsFormatter } from "../deps/dprint.ts";
import * as M from "../frame_metadata/mod.ts";
import { S } from "./S.ts";

const importSource = new URL("../mod.ts", import.meta.url).toString();

// TODO: better cli
if (import.meta.main) {
  const [metadataFile, outputFile] = Deno.args;
  const metadata = M.fromPrefixedHex(await Deno.readTextFile(metadataFile!));
  const output = codegen(metadata);
  try {
    const formatted = tsFormatter.formatText("gen.ts", output);
    await Deno.writeTextFile(outputFile!, formatted);
  } catch (e) {
    await Deno.writeTextFile(outputFile!, output);
    throw e;
  }
}

export function codegen(metadata: M.Metadata) {
  type Decl = { path: string; code: S };

  const decls: Decl[] = [];

  const { tys, extrinsic, pallets } = metadata;

  decls.push({
    path: "",
    code: [
      "import { ChainError, BitSequence, Era, $, $null, $era } from",
      S.string(importSource),
    ],
  });

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
    circular: () => null,
  });

  const typeVisitor = new M.TyVisitor<S>(tys, {
    unitStruct(ty) {
      return addTypeDecl(ty, "null");
    },
    wrapperStruct(ty, inner) {
      if (ty.path[0] === "Cow") return this.visit(inner);
      return addTypeDecl(ty, this.visit(inner));
    },
    tupleStruct(ty, members) {
      return addTypeDecl(ty, S.array(members.map((x) => this.visit(x))));
    },
    objectStruct(ty) {
      return addInterfaceDecl(
        ty,
        S.object(
          ...ty.fields.map(
            (x) => [makeDocComment(x.docs), x.name!, this.visit(x.ty)] as const,
          ),
        ),
      );
    },
    option(_ty, some) {
      return [this.visit(some), "| undefined"];
    },
    result(_ty, ok, err) {
      return [this.visit(ok), "|", ["ChainError<", this.visit(err), ">"]];
    },
    never(ty) {
      return addTypeDecl(ty, "never");
    },
    stringUnion(ty) {
      return addTypeDecl(ty, [ty.members.map((x) => ["|", S.string(x.name)])]);
    },
    taggedUnion(ty) {
      const path = getPath(ty)!;
      const name = getName(path);
      decls.push({
        path,
        code: [
          makeDocComment(ty.docs),
          ["export type", name, "="],
          ty.members.map(({ fields, name: type, docs }) => {
            let props: [S, S, S][];
            if (fields.length === 0) {
              props = [];
            } else if (fields[0]!.name === undefined) {
              // Tuple variant
              const value = fields.length === 1
                ? this.visit(fields[0]!.ty)
                : S.array(fields.map((f) => this.visit(f.ty)));
              props = [["", "value", value]];
            } else {
              // Object variant
              props = fields.map((field, i) => [
                makeDocComment(field.docs),
                field.name || i,
                this.visit(field.ty),
              ]);
            }
            decls.push({
              path: path + "." + type,
              code: [
                makeDocComment(docs),
                ["export interface", type],
                S.object(
                  ["type", S.string(type)],
                  ...props,
                ),
              ],
            });
            return ["|", path, ".", type];
          }),
        ],
      });
      return path;
    },
    uint8array(ty) {
      return addTypeDecl(ty, "Uint8Array");
    },
    array(ty) {
      return addTypeDecl(ty, ["Array<", this.visit(ty.typeParam), ">"]);
    },
    sizedUint8Array(ty) {
      return addTypeDecl(ty, "Uint8Array"); // TODO: consider `& { length: L }`
    },
    sizedArray(ty) {
      return addTypeDecl(ty, S.array(Array(ty.len).fill(this.visit(ty.typeParam))));
    },
    primitive(ty) {
      if (ty.kind === "char") return addTypeDecl(ty, "string");
      if (ty.kind === "bool") return "boolean";
      if (ty.kind === "str") return "string";
      if (+ty.kind.slice(1) < 64) return addTypeDecl(ty, "number");
      return addTypeDecl(ty, "bigint");
    },
    compact(ty) {
      decls.push({ path: "Compact", code: "export type Compact<T> = T" });
      return ["Compact<", this.visit(ty.typeParam), ">"];
    },
    bitSequence(ty) {
      return addTypeDecl(ty, "BitSequence");
    },
    map(_ty, key, val) {
      return ["Map<", this.visit(key), ",", this.visit(val), ">"];
    },
    set(_ty, val) {
      return ["Set<", this.visit(val), ">"];
    },
    era() {
      return "Era";
    },
    circular(ty) {
      return getPath(ty) || this._visit(ty);
    },
  });

  const codecVisitor = new M.TyVisitor<S>(tys, {
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
        `$.instance(ChainError<${typeVisitor.visit(err)}>, ["value", `,
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
    uint8array(ty) {
      return addCodecDecl(ty, "$.uint8array");
    },
    array(ty) {
      return addCodecDecl(ty, ["$.array(", this.visit(ty.typeParam), ")"]);
    },
    sizedUint8Array(ty) {
      return addCodecDecl(ty, `$.sizedUint8array(${ty.len})`);
    },
    sizedArray(ty) {
      return addCodecDecl(ty, ["$.sizedArray(", this.visit(ty.typeParam), ",", ty.len, ")"]);
    },
    primitive(ty) {
      return addCodecDecl(ty, getCodecPath(ty)!);
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
    circular(ty) {
      return getCodecPath(ty);
    },
  });

  typeVisitor.tys.map((x) => typeVisitor.visit(x));
  codecVisitor.tys.map((x) => codecVisitor.visit(x));

  decls.push({
    path: "Metadata",
    code: [
      "export const metadata =",
      S.object(
        [
          "extrinsic",
          S.object(
            ["version", extrinsic.version],
            ["extras", getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))],
            [
              "additional",
              getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned])),
            ],
          ),
        ],
        [
          "pallets",
          S.object(
            ...pallets.map((pallet): [S, S] => [
              pallet.name,
              S.object(
                ["name", JSON.stringify(pallet.name)],
                ["i", pallet.i],
                ["calls", pallet.calls ? codecVisitor.visit(pallet.calls.ty) : "undefined"],
                ["error", pallet.error ? codecVisitor.visit(pallet.error.ty) : "undefined"],
                ["event", pallet.event ? codecVisitor.visit(pallet.event.ty) : "undefined"],
                [
                  "storage",
                  pallet.storage
                    ? S.object(
                      ["prefix", JSON.stringify(pallet.storage.prefix)],
                      [
                        "entries",
                        S.object(...pallet.storage.entries.map((entry): [S, S, S] => [
                          makeDocComment(entry.docs),
                          entry.name,
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
                        ])),
                      ],
                    )
                    : "undefined",
                ],
              ),
            ]),
          ),
        ],
        ["types", S.array(codecVisitor.tys.map((ty) => getRawCodecPath(ty)))],
      ),
    ],
  });

  return printDecls(decls);

  function getExtrasCodec(xs: [string, number][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => codecVisitor.visit(x[1])),
    );
  }

  function getPath(ty: M.Ty): string | null {
    if (ty.type === "Struct" && ty.fields.length === 1 && ty.params.length) return null;
    return _getName(ty);

    function _getName(ty: M.Ty): string | null {
      if (ty.type === "Primitive") {
        return ty.kind;
      }
      if (ty.type === "Compact") {
        return null;
      }
      if (ty.path.at(-1) === "Era") return "Era";
      if (["Option", "Result", "Cow", "BTreeMap", "BTreeSet"].includes(ty.path[0]!)) return null;
      const baseName = ty.path.join(".");
      if (!baseName) return null;
      return baseName + ty.params.map((p, i) => {
        if (p.ty === undefined) return "";
        if (tys.every((x) => x.path.join(".") !== baseName || x.params[i]!.ty === p.ty)) {
          return "";
        }
        return ".$$" + (_getName(tys[p.ty!]!) ?? p.ty);
      }).join("");
    }
  }

  function getRawCodecPath(ty: M.Ty) {
    return `_codec.$${ty.id}`;
  }

  function getCodecPath(ty: M.Ty) {
    if (ty.type === "Primitive") {
      return ty.kind === "char" ? "$.str" : "$." + ty.kind;
    }
    const path = getPath(ty);
    if (path === null) return getRawCodecPath(ty);
    const parts = path.split(".");
    return [
      ...parts.slice(0, -1),
      "$" + parts.at(-1)![0]!.toLowerCase() + parts.at(-1)!.slice(1),
    ].join(".");
  }

  function addTypeDecl(ty: M.Ty, value: S) {
    const path = getPath(ty);
    if (path && path !== value) {
      decls.push({
        path,
        code: [makeDocComment(ty.docs), ["export type", getName(path)], "=", value],
      });
    }
    return path || value;
  }

  function addCodecDecl(ty: M.Ty, value: S) {
    const rawPath = getRawCodecPath(ty);
    decls.push({
      path: "_codec.", // no sorting
      code: [
        ["export const", getName(rawPath)],
        ": $.Codec<",
        typeVisitor.visit(ty),
        "> =",
        value,
      ],
    });
    const path = getCodecPath(ty);
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
    return path;
  }

  function addInterfaceDecl(ty: M.Ty, value: S) {
    const path = getPath(ty);
    if (path && path !== value) {
      decls.push({
        path,
        code: [makeDocComment(ty.docs), ["export interface", getName(path)], value],
      });
    }
    return path || value;
  }

  function printDecls(decls: Decl[]) {
    const namespaces: Record<string, Decl[]> = {};
    const done: Decl[] = [];
    for (const { path, code } of decls) {
      if (path.includes(".")) {
        const ns = path.split(".")[0]!;
        const rest = path.split(".").slice(1).join(".");
        (namespaces[ns] ??= []).push({ path: rest, code });
      } else {
        done.push({ path, code });
      }
    }
    for (const ns in namespaces) {
      done.push({
        path: ns,
        code: [["export namespace", ns, "{"], printDecls(namespaces[ns]!), "}"],
      });
    }
    // sort by path
    done.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
    return [...new Set(done.map((x) => S.toString(x.code)))].join("\n");
  }

  function makeDocComment(docs: string[]) {
    docs = docs.map((x) => x.replace(/^\s*\n\s*|\s*\n\s*$/, "").replace(/\s*\n\s*/g, " "));
    if (!docs.length) return "";
    if (docs.length === 1) return `/** ${docs[0]!.trim()} */\n`;
    return `/**\n  * ${docs.join("\n  * ")}\n  */`;
  }

  function getName(path: string) {
    return path.split(".").at(-1)!;
  }
}
