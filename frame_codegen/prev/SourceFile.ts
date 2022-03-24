import { EMPTY } from "/_/constants/common.ts";
import { f, newLine } from "/codegen/common.ts";
import ts from "typescript";

export const SourceFile = (
  fileName: string,
  statements: ts.Statement[],
): ts.SourceFile => {
  return f.updateSourceFile(
    ts.createSourceFile(fileName, EMPTY, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS),
    statements.reduce<ts.Statement[]>((acc, statement) => {
      return [...acc, statement, newLine];
    }, []),
  );
};
