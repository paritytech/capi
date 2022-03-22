import { FrameContext, FrameTypeDescriptor } from "/codegen/frame/Context.ts";
import { NamedImport } from "/codegen/Import.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";
import { camelCase } from "x/case/mod.ts";
import capitalizeFirstLetter from "x/case/upperFirstCase.ts";
import { comment, f, placeholderFn, scaleDecodeNamespaceIdent } from "../common.ts";

type TransformerResultByKind = m.EnsureAllTypeDefKindsAccountedFor<{
  [m.TypeDefKind.Record]: ts.CallExpression;
  [m.TypeDefKind.TaggedUnion]: ts.CallExpression;
  [m.TypeDefKind.Sequence]: ts.ArrowFunction;
  [m.TypeDefKind.FixedLenArray]: ts.ArrowFunction;
  [m.TypeDefKind.Tuple]: ts.ArrowFunction;
  [m.TypeDefKind.Primitive]: ts.PropertyAccessExpression;
  [m.TypeDefKind.Compact]: ts.PropertyAccessExpression;
  [m.TypeDefKind.BitSequence]: ts.ArrowFunction;
}>;

const ensureRelative = (inQuestion: string): string => {
  if (inQuestion.startsWith(".")) {
    return inQuestion;
  }
  return `./${inQuestion}`;
};

// TODO: have to be able to communicate the binding from within `Import` call
export const TypeDecoder = (
  context: FrameContext,
  descriptor: FrameTypeDescriptor,
): ts.VariableStatement => {
  const factories: m.StorageTransformers<TransformerResultByKind> = {
    [m.TypeDefKind.Record](typeDef) {
      return Record(
        ...typeDef.fields.map((field, i) => {
          const fieldName = field.name === undefined ? i.toString() : camelCase(field.name);
          const fieldType = context.metadata.raw.types[field.type];
          asserts.assert(fieldType);
          if (fieldType.path.length > 0) {
            const typeNameI = fieldType.path.length - 1;
            const typeName = fieldType.path[typeNameI]!;
            const importedDecodeIdent = f.createIdentifier(`decode${capitalizeFirstLetter(typeName)}`);
            descriptor.importDeclarations.push(
              NamedImport(
                importedDecodeIdent,
                ensureRelative(
                  path.relative(descriptor.sourceFileDir, path.join(context.typesOutDir, ...fieldType.path))
                    .split(path.sep).join("/").concat(".ts"),
                ),
              ),
            );
            return RecordField(fieldName, importedDecodeIdent);
          } else {
            return RecordField(fieldName, (this[fieldType.def._tag] as any)(fieldType.def));
          }
        }),
      );
    },
    [m.TypeDefKind.TaggedUnion](def) {
      console.log(descriptor.sourceFilePath);
      return f.createCallExpression(
        f.createPropertyAccessExpression(
          scaleDecodeNamespaceIdent,
          f.createIdentifier("Tagged"),
        ),
        undefined,
        [
          f.createPropertyAccessExpression(
            f.createIdentifier("TODOtagEnumIdent"),
            f.createIdentifier("TODOtagEnumMemberIdent"),
          ),
          ...def.members.map((member) => {
            return f.createCallExpression(
              f.createPropertyAccessExpression(
                scaleDecodeNamespaceIdent,
                f.createIdentifier("RecordField"),
              ),
              undefined,
              [
                f.createStringLiteral(member.name),
                Leaf("TODO"),
              ],
            );
          }),
        ],
      );
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
  decoder: ts.PropertyAccessExpression | ts.CallExpression | ts.Identifier,
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
