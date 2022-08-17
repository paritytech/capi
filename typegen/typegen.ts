import * as M from "../frame_metadata/mod.ts";
import { setup } from "../frame_metadata/test-common.ts";

const [metadata] = await setup("polkadot");

function getName(ty: M.Ty) {
  if (["Option", "Result", "Cow", "BTreeMap"].includes(ty.path[0]!)) return "";
  return ty.path.join(".")
    + ty.params.filter((x) => x.ty !== undefined).map((x) => "_" + x.ty).join("");
}

class TypegenVisitor extends M.TyVisitor<string> {
  types: [string, string][] = [];
  override _visit(ty: M.Ty): string {
    const value = super._visit(ty);
    const name = getName(ty);
    if (name) {
      this.types.push([name, value]);
    }
    const x = name || value;
    return x;
  }
}

const visitor = new TypegenVisitor(metadata.tys, {
  unitStruct() {
    return "null";
  },
  wrapperStruct(_ty, inner) {
    return this.visit(inner);
  },
  tupleStruct(_ty, members) {
    return `[${members.map((x) => this.visit(x)).join(", ")}]`;
  },
  objectStruct(ty) {
    return `{ ${ty.fields.map((x) => `${x.name!}: ${this.visit(x.ty)}`).join(", ")} }`;
  },
  option(_ty, some) {
    return `${this.visit(some)} | undefined`;
  },
  result(_ty, ok, err) {
    return `${this.visit(ok)} | ChainError<${this.visit(err)}>`;
  },
  never() {
    return "never";
  },
  stringUnion(ty) {
    return ty.members.map((x) => JSON.stringify(x.name)).join(" | ");
  },
  taggedUnion(ty) {
    return ty.members.map(({ fields, name: type }) => {
      const typeF = `type: ${JSON.stringify(type)}`;
      if (fields.length === 0) {
        return [typeF];
      } else if (fields[0]!.name === undefined) {
        // Tuple variant
        const value = fields.length === 1
          ? this.visit(fields[0]!.ty)
          : `[${fields.map((f) => this.visit(f.ty)).join(", ")}]`;
        return [typeF, `value: ${value}`];
      } else {
        // Object variant
        return [
          typeF,
          ...fields.map((field, i) => `${field.name || i}: ${this.visit(field.ty)}`),
        ];
      }
    }).map((x) => `{ ${x.join(", ")} }`).join("\n| ");
  },
  uint8array() {
    return "Uint8Array";
  },
  array(ty) {
    return `Array<${this.visit(ty.typeParam)}>`;
  },
  sizedUint8Array(ty) {
    return `Uint8Array & { length: ${ty.len} }`;
  },
  sizedArray(ty) {
    return `[${Array(ty.len).fill(this.visit(ty.typeParam)).join(", ")}]`;
  },
  primitive(ty) {
    if (ty.kind === "char") return "string";
    if (ty.kind === "bool") return "boolean";
    if (ty.kind === "str") return "string";
    if (+ty.kind.slice(1) < 64) return "number";
    return "bigint";
  },
  compact() {
    return "number | bigint";
  },
  bitSequence() {
    return "BitSequence";
  },
  map(_ty, key, val) {
    return `Map<${this.visit(key)}, ${this.visit(val)}>`;
  },
  circular(ty) {
    return getName(ty) || this._visit(ty);
  },
});

visitor.tys.map((x) => visitor.visit(x));

console.log(collectTypes(visitor.types));
console.log(`class ChainError<T> {}`);
console.log(`class BitSequence {}`);

function collectTypes(types: [string, string][]) {
  const namespaces: Record<string, [string, string][]> = {};
  const done: string[] = [];
  for (const [name, value] of types) {
    if (name.includes(".")) {
      const ns = name.split(".")[0]!;
      const rest = name.split(".").slice(1).join(".");
      (namespaces[ns] ??= []).push([rest, value]);
    } else {
      done.push(`export type ${name} = ${value};`);
    }
  }
  for (const ns in namespaces) {
    done.push(
      `export namespace ${ns} {\n  ${collectTypes(namespaces[ns]!).split("\n").join("\n  ")}\n}`,
    );
  }
  return [...new Set(done)].sort().join("\n");
}
