import { tsFormatter } from "../deps/dprint.ts";
import * as M from "../frame_metadata/mod.ts";

const importSource = new URL("../mod.ts", import.meta.url).toString();

// TODO: better cli
if (import.meta.main) {
  // put console.log in STDERR
  console.log = console.error;

  const [metadataFile, outputFile] = Deno.args;
  const metadata = M.fromPrefixedHex(await Deno.readTextFile(metadataFile!));
  const output = tsFormatter.formatText("gen.ts", typegen(metadata));
  await Deno.writeTextFile(outputFile!, output);
}

export function typegen(metadata: M.Metadata) {
  type Decl = [name: string, stmt: string];

  const decls: Decl[] = [];

  const { tys, extrinsic, pallets } = metadata;

  decls.push([
    "",
    `import type { ChainError, BitSequence, Era } from ${JSON.stringify(importSource)}\n`,
  ]);

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

  const visitor = new M.TyVisitor<string>(tys, {
    unitStruct(ty) {
      return addTypeDecl(ty, "null");
    },
    wrapperStruct(ty, inner) {
      if (ty.path[0] === "Cow") return this.visit(inner);
      return addTypeDecl(ty, this.visit(inner));
    },
    tupleStruct(ty, members) {
      return addTypeDecl(ty, `[${members.map((x) => this.visit(x)).join(", ")}]`);
    },
    objectStruct(ty) {
      return addInterfaceDecl(
        ty,
        `{\n${
          ty.fields.map(
            (x) => `${makeDocComment(x.docs)}${x.name!}: ${this.visit(x.ty)}`,
          ).join("\n")
        }\n}`,
      );
    },
    option(_ty, some) {
      return `${this.visit(some)} | undefined`;
    },
    result(_ty, ok, err) {
      return `${this.visit(ok)} | ChainError<${this.visit(err)}>`;
    },
    never(ty) {
      return addTypeDecl(ty, "never");
    },
    stringUnion(ty) {
      return addTypeDecl(ty, `${ty.members.map((x) => JSON.stringify(x.name)).join(" | ")}`);
    },
    taggedUnion(ty) {
      const name = getName(ty)!;
      const ident = lastName(name);
      decls.push([
        name,
        `${makeDocComment(ty.docs)}export type ${ident} = ${
          ty.members.map(({ fields, name: type, docs }) => {
            let props: string[];
            if (fields.length === 0) {
              props = [];
            } else if (fields[0]!.name === undefined) {
              // Tuple variant
              const value = fields.length === 1
                ? this.visit(fields[0]!.ty)
                : `[${fields.map((f) => this.visit(f.ty)).join(", ")}]`;
              props = [`value: ${value}`];
            } else {
              // Object variant
              props = fields.map((field, i) =>
                `${makeDocComment(field.docs)}${field.name || i}: ${this.visit(field.ty)}`
              );
            }
            decls.push([
              name + "." + type,
              `${makeDocComment(docs)}export interface ${type} {\n${
                [`type: ${JSON.stringify(type)}`, ...props].join("\n")
              }\n}`,
            ]);
            return name + "." + type;
          }).join(" | ")
        }`,
      ]);
      return name;
    },
    uint8array(ty) {
      return addTypeDecl(ty, "Uint8Array");
    },
    array(ty) {
      return addTypeDecl(ty, `Array<${this.visit(ty.typeParam)}>`);
    },
    sizedUint8Array(ty) {
      return addTypeDecl(ty, `Uint8Array & { length: ${ty.len} }`);
    },
    sizedArray(ty) {
      return addTypeDecl(ty, `[${Array(ty.len).fill(this.visit(ty.typeParam)).join(", ")}]`);
    },
    primitive(ty) {
      if (ty.kind === "char") return addTypeDecl(ty, "string");
      if (ty.kind === "bool") return "boolean";
      if (ty.kind === "str") return "string";
      if (+ty.kind.slice(1) < 64) return addTypeDecl(ty, "number");
      return addTypeDecl(ty, "bigint");
    },
    compact(ty) {
      return addTypeDecl(ty, "number | bigint");
    },
    bitSequence(ty) {
      return addTypeDecl(ty, "BitSequence");
    },
    map(_ty, key, val) {
      return `Map<${this.visit(key)}, ${this.visit(val)}>`;
    },
    set(_ty, val) {
      return `Set<${this.visit(val)}>`;
    },
    era() {
      return `Era`;
    },
    circular(ty) {
      return getName(ty) || this._visit(ty);
    },
  });

  visitor.tys.map((x) => visitor.visit(x));

  decls.push([
    "Metadata",
    [
      "export type Metadata = {",
      "extrinsic: {",
      `version: ${extrinsic.version},`,
      `extras: ${getExtrasType(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))},`,
      `additional: ${
        getExtrasType(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned]))
      },`,
      "},",
      "pallets: {",
      ...pallets.flatMap((pallet) => [
        `${pallet.name}: {`,
        `name: ${JSON.stringify(pallet.name)},`,
        `i: ${pallet.i},`,
        `calls: ${pallet.calls && visitor.visit(pallet.calls.ty)},`,
        `error: ${pallet.error && visitor.visit(pallet.error.ty)},`,
        `event: ${pallet.event && visitor.visit(pallet.event.ty)},`,
        ...pallet.storage
          ? [
            "storage: {",
            `prefix: ${JSON.stringify(pallet.storage.prefix)},`,
            "entries: {",
            ...pallet.storage.entries.flatMap((
              entry,
            ) => [
              `${makeDocComment(entry.docs)}${entry.name}: {`,
              `type: ${JSON.stringify(entry.type)},`,
              `modifier: ${JSON.stringify(entry.modifier)},`,
              `hashers: ${entry.type === "Map" ? JSON.stringify(entry.hashers) : "[]"},`,
              `key: ${
                entry.type === "Map"
                  ? entry.hashers.length === 1
                    ? `[${visitor.visit(entry.key)}]`
                    : visitor.visit(entry.key)
                  : "[]"
              },`,
              `value: ${visitor.visit(entry.value)},`,
              "},",
            ]),
            "}},",
          ]
          : ["storage: undefined,"],
        "}",
      ]),
      "}};",
    ].join("\n"),
  ]);

  return printDecls(decls);

  function getExtrasType(xs: [string, number][]) {
    return `[${
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => `${x[0]}: ${visitor.visit(x[1])}`)
        .join(", ")
    }]`;
  }

  function getName(ty: M.Ty): string | null {
    if (ty.type === "Struct" && ty.fields.length === 1 && ty.params.length) return null;
    return _getName(ty);

    function _getName(ty: M.Ty): string | null {
      if (ty.type === "Primitive") {
        return ty.kind;
      }
      if (ty.type === "Compact") {
        return "compact";
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

  function addTypeDecl(ty: M.Ty, value: string) {
    const name = getName(ty);
    if (name && name !== value) {
      decls.push([name, `${makeDocComment(ty.docs)}export type ${lastName(name)} = ${value}`]);
    }
    return name || value;
  }

  function addInterfaceDecl(ty: M.Ty, value: string) {
    const name = getName(ty);
    if (name && name !== value) {
      decls.push([name, `${makeDocComment(ty.docs)}export interface ${lastName(name)} ${value}`]);
    }
    return name || value;
  }

  function printDecls(decls: Decl[]) {
    const namespaces: Record<string, Decl[]> = {};
    const done: Decl[] = [];
    for (const [name, stmt] of decls) {
      if (name.includes(".")) {
        const ns = name.split(".")[0]!;
        const rest = name.split(".").slice(1).join(".");
        (namespaces[ns] ??= []).push([rest, stmt]);
      } else {
        done.push([name, stmt]);
      }
    }
    for (const ns in namespaces) {
      done.push([
        ns,
        `export namespace ${ns} {\n${printDecls(namespaces[ns]!)}\n}`,
      ]);
    }
    // sort by name, then by content
    done.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1);
    return [...new Set(done.map((x) => x[1]))].join("\n");
  }

  function makeDocComment(docs: string[]) {
    docs = docs.map((x) => x.replace(/^\s*\n\s*|\s*\n\s*$/, "").replace(/\s*\n\s*/g, " "));
    if (!docs.length) return "";
    if (docs.length === 1) return `/** ${docs[0]} */\n`;
    return `/**\n  * ${docs.join("\n  * ")}\n  */\n`;
  }

  function lastName(name: string) {
    return name.split(".").at(-1);
  }
}
