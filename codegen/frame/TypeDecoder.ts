import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";
import { camelCase } from "x/case/mod.ts";
import capitalizeFirstLetter from "x/case/upperFirstCase.ts";
import { comment, f, Factory } from "../common.ts";

type TransformerResultByKind = m.EnsureAllTypeDefKindsAccountedFor<{
  [m.TypeDefKind.Record]: ts.CallExpression;
  [m.TypeDefKind.TaggedUnion]: never;
  [m.TypeDefKind.Sequence]: never;
  [m.TypeDefKind.FixedLenArray]: never;
  [m.TypeDefKind.Tuple]: never;
  [m.TypeDefKind.Primitive]: never;
  [m.TypeDefKind.Compact]: never;
  [m.TypeDefKind.BitSequence]: never;
}>;

// TODO: have to be able to communicate the binding from within `Import` call
export const TypeDecoder = (
  decodeNamespaceIdent: ts.Identifier,
  metadata: m.MetadataContainer,
  storageEntry: m.StorageEntry,
): Factory<[ts.VariableStatement]> => {
  return (_config) => {
    const factories: m.StorageTransformers<TransformerResultByKind> = {
      [m.TypeDefKind.Record](typeDef) {
        return Record(
          ...typeDef.fields.map((field, i) => {
            return RecordField(
              field.name === undefined ? i.toString() : camelCase(field.name),
              () => TyIDecoder(field.type) as any,
            );
          }),
        )(decodeNamespaceIdent);
      },
      [m.TypeDefKind.TaggedUnion]() {
        asserts.unimplemented();
      },
      [m.TypeDefKind.Sequence]() {
        asserts.unimplemented();
      },
      [m.TypeDefKind.FixedLenArray]() {
        asserts.unimplemented();
      },
      [m.TypeDefKind.Tuple]() {
        asserts.unimplemented();
      },
      [m.TypeDefKind.Primitive]() {
        asserts.unimplemented();
      },
      [m.TypeDefKind.Compact]() {
        asserts.unimplemented();
      },
      [m.TypeDefKind.BitSequence]() {
        asserts.unimplemented();
      },
    };

    // TODO: reuse elsewhere
    const TyIDecoder = (i: number): ts.Expression => {
      // TODO: versions?
      asserts.assert(metadata.raw._tag === 14);
      const ty = metadata.raw.types[i];
      asserts.assert(ty);
      return (factories[ty.def._tag] as any)(ty.def);
    };

    const statement = f.createVariableStatement(
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      f.createVariableDeclarationList(
        [f.createVariableDeclaration(
          f.createIdentifier(`decode${capitalizeFirstLetter(storageEntry.name)}`),
          undefined,
          undefined,
          TyIDecoder(storageEntry.type.value),
        )],
        ts.NodeFlags.Const,
      ),
    );
    comment(statement, "THE DECODER COMMENT");
    return [statement];
  };
};

export const Leaf = (decoderExportName: string): ((ident: ts.Identifier) => ts.PropertyAccessExpression) => {
  return (decodeNamespaceIdent) => {
    return f.createPropertyAccessExpression(decodeNamespaceIdent, f.createIdentifier(decoderExportName));
  };
};

export const Record = (...fields: ((i: ts.Identifier) => ts.CallExpression)[]) => {
  return (decodeNamespaceIdent: ts.Identifier) => {
    return f.createCallExpression(
      f.createPropertyAccessExpression(decodeNamespaceIdent, f.createIdentifier("Record")),
      undefined,
      fields.map((field) => field(decodeNamespaceIdent)),
    );
  };
};

export const RecordField = (
  key: string,
  decoder: (i: ts.Identifier) => ts.PropertyAccessExpression | ts.CallExpression,
) =>
  (decodeNamespaceIdent: ts.Identifier) => {
    return f.createCallExpression(
      f.createPropertyAccessExpression(
        decodeNamespaceIdent,
        f.createIdentifier("RecordField"),
      ),
      undefined,
      [f.createStringLiteral(key), decoder(decodeNamespaceIdent)],
    );
  };
