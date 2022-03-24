import { Chain } from "/frame_codegen/Chain.ts";
import { nf, SourceFile } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/NamedType.ts";
import { TypeBase } from "/frame_codegen/TypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export abstract class NamedTypeBase<
  Statements extends ts.Statement[],
  TypeDef extends m.NamedTypeDef,
> extends TypeBase<TypeDef> {
  name;
  nameIdent;
  chainOutDirRelativeSourceFilePath;
  overloads;

  constructor(
    chain: Chain,
    rawType: m.Type<TypeDef>,
  ) {
    super(chain, rawType);
    this.overloads = rawType.params.length > 0 ? [rawType.params] : [];
    asserts.assert(rawType.path.length > 0);
    const lastJunctionI = rawType.path.length - 1;
    const lastJunction = rawType.path[lastJunctionI];
    asserts.assert(lastJunction);
    this.name = lastJunction;
    this.nameIdent = nf.createIdentifier(lastJunction);
    this.chainOutDirRelativeSourceFilePath = path.join(...rawType.path).concat(".ts");
  }

  addImport = (typeDesc: NamedType) => {
    const existing = this.imports.get(typeDesc);
    if (existing) {
      return existing;
    }
    const newlyCreated = nf.createUniqueName(typeDesc.name);
    this.imports.set(typeDesc, newlyCreated);
    return newlyCreated;
  };

  get importStatements(): ts.ImportDeclaration[] {
    const statements: ts.ImportDeclaration[] = [];
    for (const [type, ident] of this.imports.entries()) {
      statements.push(nf.createImportDeclaration(
        undefined,
        undefined,
        nf.createImportClause(
          false,
          undefined,
          nf.createNamedImports([nf.createImportSpecifier(
            false,
            type.nameIdent,
            ident,
          )]),
        ),
        nf.createStringLiteral(type.importPathFrom(this)),
        undefined,
      ));
    }
    return statements;
  }

  overload(params: m.Param[]): void {
    this.overloads.push(params);
  }

  abstract get statements(): Statements;

  sourceFile(chainOutDir: string): ts.SourceFile {
    const sourceFilePath = path.join(chainOutDir, this.chainOutDirRelativeSourceFilePath);
    const statements = this.statements;
    return SourceFile(sourceFilePath, [
      ...this.importStatements,
      ...statements,
    ]);
  }
}
