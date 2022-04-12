import { EMPTY } from "/_/constants/common.ts";
import ts from "typescript";

export const nf = ts.factory;

export const SourceFile = (
  sourceFilePath: string,
  statements: ts.Statement[],
) => {
  const initialSourceFile = ts.createSourceFile(sourceFilePath, EMPTY, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  return nf.updateSourceFile(initialSourceFile, statements);
};

export const newLine: ts.Statement = nf.createIdentifier("\n") as any;
