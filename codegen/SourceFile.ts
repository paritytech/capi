import { EMPTY } from "/_/constants/common.ts";
import { f, Factory, newLine } from "/codegen/common.ts";
import ts from "typescript";

export const SourceFile = (
  fileName: string,
  statementsFactories: Factory<ts.Statement[]>[],
): Factory<ts.SourceFile> => {
  return (config) => {
    return f.updateSourceFile(
      ts.createSourceFile(fileName, EMPTY, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS),
      statementsFactories.reduce((acc0, statementsFactory) => {
        return [
          ...acc0,
          ...statementsFactory(config).reduce((acc1, statement) => {
            return [...acc1, statement, newLine];
          }, [] as ts.Statement[]),
        ];
      }, [] as ts.Statement[]),
    );
  };
};
