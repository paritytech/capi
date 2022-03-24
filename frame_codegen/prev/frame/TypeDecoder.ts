import { FrameContext, FrameTypeDescriptor } from "/codegen/frame/Context.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";
import { camelCase, pascalCase } from "x/case/mod.ts";
import capitalizeFirstLetter from "x/case/upperFirstCase.ts";
import { comment, f, placeholderFn, scaleDecodeNamespaceIdent } from "../common.ts";

type TypeDecoderVisitor = Omit<
  m.TypeDefVisitor<{
    [m.TypeDefKind.Record]: ts.CallExpression;
    [m.TypeDefKind.TaggedUnion]: ts.CallExpression;
    [m.TypeDefKind.Sequence]: ts.CallExpression;
    [m.TypeDefKind.FixedLenArray]: ts.CallExpression;
    [m.TypeDefKind.Tuple]: ts.CallExpression;
    [m.TypeDefKind.Primitive]: ts.PropertyAccessExpression;
    [m.TypeDefKind.Compact]: ts.PropertyAccessExpression;
    [m.TypeDefKind.BitSequence]: ts.PropertyAccessExpression;
  }>,
  m.TypeDefKind.Compact
>;

// TODO: have to be able to communicate the binding from within `Import` call
export class TypeDecoder implements TypeDecoderVisitor {
  types;

  constructor(
    readonly context: FrameContext,
    readonly descriptor: FrameTypeDescriptor,
  ) {
    this.types = context.metadata.raw.types;
  }

  digest(): ts.VariableStatement {
    let root: ts.CallExpression;
    const def = this.descriptor.raw.def;
    switch (def._tag) {
      case m.TypeDefKind.Record: {
        root = this.Record(def);
        break;
      }
      case m.TypeDefKind.TaggedUnion: {
        root = this.TaggedUnion(def);
        break;
      }
      default: {
        asserts.unreachable();
      }
    }
    const statement = f.createVariableStatement(
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      f.createVariableDeclarationList(
        [f.createVariableDeclaration(
          f.createIdentifier(`decode${capitalizeFirstLetter(this.descriptor.name)}`),
          undefined,
          f.createTypeReferenceNode(
            f.createQualifiedName(
              scaleDecodeNamespaceIdent,
              f.createIdentifier("Decoder"),
            ),
            [f.createTypeReferenceNode(this.descriptor.name)],
          ),
          root,
        )],
        ts.NodeFlags.Const,
      ),
    );
    comment(statement, "THE DECODER COMMENT");
    return statement;
  }

  visit(def: m.TypeDef, i: number): ts.PropertyAccessExpression | ts.CallExpression | ts.Identifier {
    switch (def._tag) {
      case m.TypeDefKind.BitSequence: {
        return this.BitSequence(def);
      }
      case m.TypeDefKind.Compact: {
        return this.Leaf("compact");
      }
      case m.TypeDefKind.FixedLenArray: {
        return this.FixedLenArray(def);
      }
      case m.TypeDefKind.Primitive: {
        return this.Primitive(def);
      }
      case m.TypeDefKind.Sequence: {
        return this.Sequence(def);
      }
      case m.TypeDefKind.Tuple: {
        return this.Tuple(def);
      }
      case m.TypeDefKind.Record: {
        return this.Reference(i);
      }
      case m.TypeDefKind.TaggedUnion: {
        if (this.context.isOptionByI[i]) {
          const some = def.members[1];
          asserts.assert(some?.name === "Some" && some.fields.length === 1);
          const someValue = some.fields[0];
          asserts.assert(someValue);
          const someValueType = this.types[someValue.type];
          asserts.assert(someValueType);
          console.log(this.descriptor.sourceFilePath);
          return f.createCallExpression(
            f.createPropertyAccessExpression(
              scaleDecodeNamespaceIdent,
              f.createIdentifier("Option"),
            ),
            undefined,
            [this.visit(someValueType.def, someValue.type)],
          );
        }
        return this.Reference(i);
      }
    }
  }

  Reference(i: number) {
    const referencedDesc = this.context.typeDescriptorByI[i];
    asserts.assert(referencedDesc);
    this.descriptor.importDecoder(referencedDesc);
    return referencedDesc.decoderNameIdent;
  }

  Record(def: m.RecordTypeDef): ts.CallExpression {
    return f.createCallExpression(
      f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier("Record")),
      undefined,
      def.fields.map((field, i) => {
        const fieldName = field.name === undefined ? i.toString() : camelCase(field.name);
        const fieldType = this.types[field.type];
        asserts.assert(fieldType);
        const fieldTypeDescriptor = this.context.typeDescriptorByI[field.type];
        if (fieldTypeDescriptor) {
          this.descriptor.importDecoder(fieldTypeDescriptor);
          return this.RecordField(fieldName, fieldTypeDescriptor.decoderNameIdent);
        } else {
          return this.RecordField(fieldName, this.visit(fieldType.def, field.type));
        }
      }),
    );
  }

  TaggedUnion(def: m.TaggedUnionTypeDef): ts.CallExpression {
    return f.createCallExpression(
      f.createPropertyAccessExpression(
        scaleDecodeNamespaceIdent,
        f.createIdentifier("Union"),
      ),
      undefined,
      def.members.map((member) => {
        return f.createCallExpression(
          f.createPropertyAccessExpression(
            scaleDecodeNamespaceIdent,
            f.createIdentifier("Tagged"),
          ),
          undefined,
          [
            f.createPropertyAccessExpression(
              this.descriptor.tagEnumIdent,
              f.createIdentifier(pascalCase(member.name)),
            ),
            ...member.fields.map((field, i) => {
              const fieldType = this.context.metadata.raw.types[field.type];
              asserts.assert(fieldType);
              return f.createCallExpression(
                f.createPropertyAccessExpression(
                  scaleDecodeNamespaceIdent,
                  f.createIdentifier("RecordField"),
                ),
                undefined,
                [
                  // TODO: extract handling of field names
                  f.createStringLiteral(field.name === undefined ? i.toString() : camelCase(field.name)),
                  this.visit(fieldType.def, field.type),
                ],
              );
            }),
          ],
        );
      }),
    );
  }

  Sequence(def: m.SequenceTypeDef): ts.CallExpression {
    const typeParam = this.context.metadata.raw.types[def.typeParam];
    asserts.assert(typeParam);
    return f.createCallExpression(
      f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier("UnknownSizeArray")),
      undefined,
      [this.visit(typeParam.def, def.typeParam)],
    );
  }

  FixedLenArray(def: m.FixedLenArrayTypeDef): ts.CallExpression {
    const typeParam = this.context.metadata.raw.types[def.typeParam];
    asserts.assert(typeParam);
    return f.createCallExpression(
      f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier("FixedSizeArray")),
      undefined,
      [this.visit(typeParam.def, def.typeParam), f.createNumericLiteral(def.len)],
    );
  }

  Tuple(def: m.TupleTypeDef): ts.CallExpression {
    const fieldDecoderNodes = def.fields.map((field) => {
      const fieldType = this.context.metadata.raw.types[field];
      asserts.assert(fieldType);
      return this.visit(fieldType.def, field);
    });
    return f.createCallExpression(
      f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier("Tuple")),
      undefined,
      fieldDecoderNodes,
    );
  }

  Primitive(def: m.PrimitiveTypeDef): ts.PropertyAccessExpression {
    return this.Leaf(def.kind);
  }

  // TODO:
  BitSequence(def: m.BitSequenceTypeDef): ts.PropertyAccessExpression {
    return placeholderFn as any;
  }

  Leaf(decoderExportName: string): ts.PropertyAccessExpression {
    return f.createPropertyAccessExpression(scaleDecodeNamespaceIdent, f.createIdentifier(decoderExportName));
  }

  RecordField(
    key: string,
    decoder: ts.PropertyAccessExpression | ts.CallExpression | ts.Identifier,
  ) {
    return f.createCallExpression(
      f.createPropertyAccessExpression(
        scaleDecodeNamespaceIdent,
        f.createIdentifier("RecordField"),
      ),
      undefined,
      [f.createStringLiteral(key), decoder],
    );
  }
}
