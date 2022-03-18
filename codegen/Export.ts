import { f, Factory } from "/codegen/common.ts";
import ts from "typescript";

export const ExportStar = (from: string): Factory<[ts.ExportDeclaration]> => {
  return (_config) => {
    return [f.createExportDeclaration(
      undefined,
      undefined,
      false,
      undefined,
      f.createStringLiteral(from),
      undefined,
    )];
  };
};
