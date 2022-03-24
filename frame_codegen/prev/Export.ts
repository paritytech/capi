import { f } from "/codegen/common.ts";
import ts from "typescript";

export const ExportStar = (moduleSpecifierText: string): ts.ExportDeclaration => {
  return f.createExportDeclaration(
    undefined,
    undefined,
    false,
    undefined,
    f.createStringLiteral(moduleSpecifierText),
    undefined,
  );
};
