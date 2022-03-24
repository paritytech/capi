import { nf } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/NamedType.ts";
import { Type } from "/frame_codegen/Type.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export abstract class TypeBase<TypeDef extends m.TypeDef> {
  #imports = new Map<NamedType, ts.Identifier>();
  next?: Type;

  constructor(readonly rawType: m.Type<TypeDef>) {}

  import(typeDesc: NamedType): ts.Identifier {
    const existing = this.#imports.get(typeDesc);
    if (existing) {
      return existing;
    }
    const newlyCreated = nf.createUniqueName(typeDesc.name);
    this.#imports.set(typeDesc, newlyCreated);
    return newlyCreated;
  }

  equals(inQuestion: TypeBase<m.TypeDef>): boolean {
    // TODO
    return false;
  }
}
