import * as M from "../frame_metadata/mod.ts";
import { setup } from "../frame_metadata/test-common.ts";

type Decl = [name: string, stmt: string];

function lastName(name: string) {
  return name.split(".").at(-1);
}

function typegen(tys: M.Ty[]) {
  const decls: Decl[] = [];

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
        `{ ${ty.fields.map((x) => `${x.name!}: ${this.visit(x.ty)}`).join(", ")} }`,
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
        `export type ${ident} = ${
          ty.members.map(({ fields, name: type }) => {
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
              props = fields.map((field, i) => `${field.name || i}: ${this.visit(field.ty)}`);
            }
            decls.push([
              name + "." + type,
              `export interface ${type} { ${
                [`type: ${JSON.stringify(type)}`, ...props].join(", ")
              } }`,
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
    circular(ty) {
      return getName(ty) || this._visit(ty);
    },
  });

  visitor.tys.map((x) => visitor.visit(x));

  return printDecls(decls);

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
      decls.push([name, `export type ${lastName(name)} = ${value}`]);
    }
    return name || value;
  }

  function addInterfaceDecl(ty: M.Ty, value: string) {
    const name = getName(ty);
    if (name && name !== value) {
      decls.push([name, `export interface ${lastName(name)} ${value}`]);
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
        `export namespace ${ns} {\n  ${printDecls(namespaces[ns]!).split("\n").join("\n  ")}\n}`,
      ]);
    }
    // sort by name, then by content
    done.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1);
    return [...new Set(done.map((x) => x[1]))].join("\n");
  }
}

for (
  const network of [
    "acala",
    "kusama",
    "moonbeam",
    "polkadot",
    "statemint",
    "subsocial",
    "westend",
  ] as const
) {
  const [metadata] = await setup(network);
  console.log(`export namespace ${network} {\n${typegen(metadata.tys)}\n}`);
}

console.log(`class ChainError<T> {}`);
console.log(`class BitSequence {}`);
