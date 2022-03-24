import { Chain } from "/frame_codegen/Chain.ts";
import { nf } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/NamedType.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export abstract class TypeBase<TypeDef extends m.TypeDef> {
  #imports = new Map<NamedType, ts.Identifier>();

  constructor(
    readonly chain: Chain,
    readonly rawType: m.Type<TypeDef>,
  ) {}

  addImport = (typeDesc: NamedType) => {
    const existing = this.#imports.get(typeDesc);
    if (existing) {
      return existing;
    }
    const newlyCreated = nf.createUniqueName(typeDesc.name);
    this.#imports.set(typeDesc, newlyCreated);
    return newlyCreated;
  };

  equals(inQuestion: TypeBase<m.TypeDef>): boolean {
    // TODO
    return false;
  }

  get importStatements(): ts.ImportDeclaration[] {
    const statements: ts.ImportDeclaration[] = [];
    for (const [type, ident] of this.#imports.entries()) {
      statements.push(nf.createImportDeclaration(
        undefined,
        undefined,
        nf.createImportClause(
          false,
          undefined,
          nf.createNamedImports([nf.createImportSpecifier(
            false,
            undefined,
            ident,
          )]),
        ),
        nf.createStringLiteral("TODO"),
        undefined,
      ));
    }
    return statements;
  }
}
