import { SourceFile } from "/frame_codegen/common.ts";
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
  chainOutDirRelativeSourceFilePath;

  constructor(
    rawType: m.Type<TypeDef>,
    overloads?: m.Param[][],
  ) {
    super(rawType, overloads);
    asserts.assert(rawType.path.length > 0);
    const lastJunctionI = rawType.path.length - 1;
    const lastJunction = rawType.path[lastJunctionI];
    asserts.assert(lastJunction);
    this.name = lastJunction;
    this.chainOutDirRelativeSourceFilePath = path.join(...rawType.path).concat(".ts");
  }

  abstract get statements(): Statements;

  sourceFile(chainOutDir: string): ts.SourceFile {
    const sourceFilePath = path.join(chainOutDir, this.chainOutDirRelativeSourceFilePath);
    return SourceFile(sourceFilePath, this.statements);
  }
}
