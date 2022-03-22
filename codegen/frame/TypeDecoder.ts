import { FrameContext, FrameTypeDescriptor } from "/codegen/frame/Context.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";
import { camelCase } from "x/case/mod.ts";
import capitalizeFirstLetter from "x/case/upperFirstCase.ts";
import { comment, f, placeholderFn, scaleDecodeNamespaceIdent } from "../common.ts";

type TransformerResultByKind = m.EnsureAllTypeDefKindsAccountedFor<{
  [m.TypeDefKind.Record]: ts.CallExpression;
  [m.TypeDefKind.TaggedUnion]: ts.ArrowFunction;
  [m.TypeDefKind.Sequence]: ts.ArrowFunction;
  [m.TypeDefKind.FixedLenArray]: ts.ArrowFunction;
  [m.TypeDefKind.Tuple]: ts.ArrowFunction;
  [m.TypeDefKind.Primitive]: ts.PropertyAccessExpression;
  [m.TypeDefKind.Compact]: ts.PropertyAccessExpression;
  [m.TypeDefKind.BitSequence]: ts.ArrowFunction;
}>;

// TODO: have to be able to communicate the binding from within `Import` call
export const TypeDecoder = (
  context: FrameContext,
  descriptor: FrameTypeDescriptor,
): ts.VariableStatement => {
  const factories: m.StorageTransformers<TransformerResultByKind> = {
    [m.TypeDefKind.Record](typeDef) {
      return Record(
        ...typeDef.fields.map((field, i) => {
          return RecordField(
            field.name === undefined ? i.toString() : camelCase(field.name),
            Leaf("TODO"),
          );
        }),
      );
    },
    [m.TypeDefKind.TaggedUnion]() {
      return placeholderFn;
    },
    [m.TypeDefKind.Sequence]() {
      return placeholderFn;
    },
    [m.TypeDefKind.FixedLenArray]() {
      return placeholderFn;
    },
    [m.TypeDefKind.Tuple]() {
      return placeholderFn;
    },
    [m.TypeDefKind.Primitive](typeDef) {
      return Leaf(typeDef.kind);
    },
    [m.TypeDefKind.Compact]() {
      return Leaf("compact");
    },
    [m.TypeDefKind.BitSequence]() {
      return placeholderFn;
    },
  };

  const statement = f.createVariableStatement(
    [f.createModifier(ts.SyntaxKind.ExportKeyword)],
    f.createVariableDeclarationList(
      [f.createVariableDeclaration(
        f.createIdentifier(`decode${capitalizeFirstLetter(descriptor.name)}`),
        undefined,
        f.createTypeReferenceNode(
          f.createQualifiedName(
            scaleDecodeNamespaceIdent,
            f.createIdentifier("Decoder"),
          ),
          [f.createTypeReferenceNode(descriptor.name)],
        ),
        (factories[descriptor.raw.def._tag] as any)(descriptor.raw.def),
      )],
      ts.NodeFlags.Const,
    ),
  );
  comment(statement, "THE DECODER COMMENT");
  return statement;
};

export const Leaf = (decoderExportName: string): ts.PropertyAccessExpression => {
  return f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier(decoderExportName));
};

export const Record = (...fields: ts.CallExpression[]) => {
  return f.createCallExpression(
    f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier("Record")),
    undefined,
    fields,
  );
};

export const RecordField = (
  key: string,
  decoder: ts.PropertyAccessExpression | ts.CallExpression,
) => {
  return f.createCallExpression(
    f.createPropertyAccessExpression(
      scaleDecodeNamespaceIdent,
      f.createIdentifier("RecordField"),
    ),
    undefined,
    [f.createStringLiteral(key), decoder],
  );
};
