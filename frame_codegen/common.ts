import { EMPTY } from "/_/constants/common.ts";
import { isNamedType, NamedType } from "/frame_codegen/NamedType.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export const nf = ts.factory;

export const SourceFile = (
  sourceFilePath: string,
  statements: ts.Statement[],
) => {
  const initialSourceFile = ts.createSourceFile(sourceFilePath, EMPTY, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  return nf.updateSourceFile(initialSourceFile, statements);
};

export const FieldPropertySignatureFactory = (containerType: NamedType) => {
  return (
    rawField: m.Field,
    i: number,
  ): ts.PropertySignature => {
    const type = containerType.chain.getType(rawField.type);
    const typeNode = isNamedType(type) ? nf.createTypeReferenceNode(containerType.addImport(type)) : type.node;
    return nf.createPropertySignature(
      undefined,
      nf.createIdentifier(rawField.name || i.toString()),
      undefined,
      typeNode,
    );
  };
};
