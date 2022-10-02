import * as M from "../frame_metadata/mod.ts";
import { Decl, getName, getPath, makeDocComment, S } from "./utils.ts";

export function createTypeVisitor(tys: M.Ty[], decls: Decl[]) {
  return new M.TyVisitor<S>(tys, {
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
      const path = getPath(tys, ty)!;
      const name = getName(path);
      decls.push({
        path,
        code: [
          makeDocComment(ty.docs),
          ["export type", name, "="],
          ty.members.map(({ fields, name: type, docs }) => {
            let props: [comment: S, name: S, type: S][];
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
      return getPath(tys, ty) || this._visit(ty);
    },
  });

  function addTypeDecl(ty: M.Ty, value: S) {
    const path = getPath(tys, ty);
    if (path && path !== value) {
      decls.push({
        path,
        code: [makeDocComment(ty.docs), ["export type", getName(path)], "=", value],
      });
    }
    return path || value;
  }

  function addInterfaceDecl(ty: M.Ty, value: S) {
    const path = getPath(tys, ty);
    if (path && path !== value) {
      decls.push({
        path,
        code: [makeDocComment(ty.docs), ["export interface", getName(path)], value],
      });
    }
    return path || value;
  }
}
