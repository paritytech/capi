import { intersperse } from "/_/util/mod.ts";
import { Chain } from "/frame_codegen/Chain.ts";
import { newLine, nf, SourceFile } from "/frame_codegen/common.ts";
import { Type } from "/frame_codegen/type/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export abstract class NamedType<
  TypeDef extends m.NamedTypeDef = m.NamedTypeDef,
  Statements extends ts.Statement[] = ts.Statement[],
> extends Type<TypeDef> {
  imports = new Map<NamedType, ts.Identifier>();
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

  abstract get statements(): Statements;

  // TODO: fix this
  importPathFrom = (to: NamedType): string => {
    const maybeWithoutRelativePrefix = path.relative(
      path.join(...this.rawType.path.slice(0, this.rawType.path.length - 1)),
      path.join(...to.rawType.path),
    ).split(path.sep).join("/").concat(".ts");
    return maybeWithoutRelativePrefix.startsWith(".") ? maybeWithoutRelativePrefix : `./${maybeWithoutRelativePrefix}`;
  };

  overload = (params: m.Param[]): void => {
    this.overloads.push(params);
  };

  addImport = (typeDesc: NamedType) => {
    const existing = this.imports.get(typeDesc);
    if (existing) {
      return existing;
    }
    const newlyCreated = nf.createUniqueName(typeDesc.name);
    this.imports.set(typeDesc, newlyCreated);
    return newlyCreated;
  };

  SourceFile = (): ts.SourceFile => {
    const sourceFilePath = path.join(this.chain.typesOurDirAbs, this.chainOutDirRelativeSourceFilePath);
    const statements = this.statements;
    return SourceFile(sourceFilePath, [
      ...this.ImportStatements(),
      newLine,
      ...intersperse(statements, newLine),
    ]);
  };

  ImportStatements = (): ts.ImportDeclaration[] => {
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
        nf.createStringLiteral(this.importPathFrom(type)),
        undefined,
      ));
    }
    return statements;
  };
}
