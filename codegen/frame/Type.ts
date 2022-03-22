import { comment, f, PropertySignature } from "/codegen/common.ts";
import { FrameContext, FrameTypeDescriptor } from "/codegen/frame/Context.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

type RecordStatements = [ts.InterfaceDeclaration];
type TaggedUnionStatements = [ts.TypeAliasDeclaration, ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | []];

type FieldTypeNode =
  | ts.TypeReferenceNode
  | ts.LiteralTypeNode
  | ts.KeywordTypeNode
  | ts.TupleTypeNode
  | ts.ArrayTypeNode;

export const Type = (
  context: FrameContext,
  descriptor: FrameTypeDescriptor<m.RecordTypeDef | m.TaggedUnionTypeDef>,
): RecordStatements | TaggedUnionStatements => {
  const RootRecordType = (descriptor: FrameTypeDescriptor<m.RecordTypeDef>): RecordStatements => {
    const interfaceDecl = f.createInterfaceDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      descriptor.nameIdent,
      undefined,
      undefined,
      descriptor.raw.def.fields.map((field, i) => {
        let fieldTypeNode: FieldTypeNode;
        const fieldTypeDescriptor = context.typeDescriptorByI[field.type];
        if (fieldTypeDescriptor) {
          descriptor.addNamedImport(fieldTypeDescriptor);
          fieldTypeNode = f.createTypeReferenceNode(fieldTypeDescriptor.nameIdent);
        } else {
          const fieldType = context.metadata.raw.types[field.type];
          asserts.assert(fieldType);
          switch (fieldType.def._tag) {
            case m.TypeDefKind.FixedLenArray: {
              fieldTypeNode = FixedLenArray(fieldType.def);
              break;
            }
            case m.TypeDefKind.Primitive: {
              fieldTypeNode = Primitive(fieldType.def);
              break;
            }
            case m.TypeDefKind.Sequence: {
              fieldTypeNode = Sequence(fieldType.def);
              break;
            }
            case m.TypeDefKind.Compact: {
              fieldTypeNode = f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
              break;
            }
            case m.TypeDefKind.Tuple: {
              fieldTypeNode = Tuple(fieldType.def);
              break;
            }
            case m.TypeDefKind.BitSequence: {
              fieldTypeNode = BitSequence(fieldType.def);
              break;
            }
            default: {
              asserts.unreachable();
            }
          }
        }
        const propertySignature = PropertySignature(field.name || i.toString(), fieldTypeNode);
        comment(propertySignature, field.docs.join("\n"));
        return propertySignature;
      }) || [],
    );
    if (descriptor.raw.docs) {
      comment(interfaceDecl, descriptor.raw.docs.join("\n"));
    }
    return [interfaceDecl];
  };

  const BitSequence = (def: m.BitSequenceTypeDef): ts.TypeReferenceNode => {
    return f.createTypeReferenceNode(f.createIdentifier("Uint8Array"));
  };

  const RootTaggedUnionType = (descriptor: FrameTypeDescriptor<m.TaggedUnionTypeDef>): TaggedUnionStatements => {
    // Rust enums with no members are equivalent to `never` in TypeScript.
    if (descriptor.raw.def.members.length === 0) {
      return [f.createTypeAliasDeclaration(
        undefined,
        [f.createModifier(ts.SyntaxKind.ExportKeyword)],
        descriptor.nameIdent,
        undefined,
        f.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
      )];
    }

    const variantDeclarations: ts.InterfaceDeclaration[] = [];
    const unionMemberIdents: ts.Identifier[] = [];
    const tagEnumMembers: ts.EnumMember[] = [];
    const tagEnumIdent = f.createIdentifier(`${descriptor.name}Tag`);

    for (let i = 0; i < descriptor.raw.def.members.length; i++) {
      const member = descriptor.raw.def.members[i]!;
      const memberName = f.createIdentifier(member.name);
      unionMemberIdents.push(memberName);

      const memberTagName = isNaN(Number(member.name)) ? member.name : `_${member.name}`;
      const memberTagIdent = f.createIdentifier(memberTagName);
      tagEnumMembers.push(f.createEnumMember(memberTagIdent, f.createStringLiteral(member.name)));

      const decl = f.createInterfaceDeclaration(
        undefined,
        [f.createModifier(ts.SyntaxKind.ExportKeyword)],
        memberName,
        undefined,
        undefined,
        [
          PropertySignature(
            "_tag",
            f.createTypeReferenceNode(f.createQualifiedName(tagEnumIdent, memberTagIdent), undefined),
          ),
          ...member.fields.map((field, i) => {
            let fieldValueTypeNode: FieldTypeNode | undefined;
            const fieldType = context.metadata.raw.types[field.type];
            asserts.assert(fieldType);
            if (fieldType.path.length > 0) {
              const fieldTypeDescriptor = context.typeDescriptorByI[field.type];
              asserts.assert(fieldTypeDescriptor);
              descriptor.addNamedImport(fieldTypeDescriptor);
              fieldValueTypeNode = f.createTypeReferenceNode(fieldTypeDescriptor.nameIdent);
            } else {
              switch (fieldType.def._tag) {
                case m.TypeDefKind.Primitive: {
                  fieldValueTypeNode = Primitive(fieldType.def);
                  break;
                }
                case m.TypeDefKind.Compact: {
                  fieldValueTypeNode = f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
                  break;
                }
                case m.TypeDefKind.FixedLenArray: {
                  fieldValueTypeNode = FixedLenArray(fieldType.def as any /* TODO */);
                  break;
                }
                case m.TypeDefKind.Sequence: {
                  fieldValueTypeNode = Sequence(fieldType.def as any /* TODO */);
                  break;
                }
                case m.TypeDefKind.Tuple: {
                  fieldValueTypeNode = Tuple(fieldType.def as any /* TODO */);
                  break;
                }
                default: {
                  asserts.unreachable();
                }
              }
            }
            const fieldTypeNode = PropertySignature(field.name || i.toString(), fieldValueTypeNode);
            comment(fieldTypeNode, field.docs.join("\n"));
            return fieldTypeNode;
          }) || [],
        ],
      );
      if (member.docs) {
        comment(decl, member.docs.join("\n"));
      }
      variantDeclarations.push(decl);
    }

    const unionDeclaration = f.createTypeAliasDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      descriptor.nameIdent,
      undefined,
      f.createUnionTypeNode(unionMemberIdents.map((x) => {
        return f.createTypeReferenceNode(x, undefined);
      })),
    );
    if (descriptor.raw.docs) {
      comment(unionDeclaration, descriptor.raw.docs.join("\n"));
    }

    const enumDeclaration = f.createEnumDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword), f.createModifier(ts.SyntaxKind.ConstKeyword)],
      tagEnumIdent,
      tagEnumMembers,
    );

    return [unionDeclaration, enumDeclaration, ...variantDeclarations];
  };

  const FixedLenArray = (def: m.FixedLenArrayTypeDef): ts.ArrayTypeNode => {
    const elementType = context.metadata.raw.types[def.typeParam];
    let element: ts.TypeNode;
    asserts.assert(elementType);
    switch (elementType.def._tag) {
      case m.TypeDefKind.Primitive: {
        element = Primitive(elementType.def);
        break;
      }
      case m.TypeDefKind.Tuple: {
        element = Tuple(elementType.def);
        break;
      }
      default: {
        asserts.unreachable();
      }
    }
    return f.createArrayTypeNode(element);
  };

  const Sequence = (def: m.SequenceTypeDef): ts.ArrayTypeNode => {
    const typeParamDescriptor = context.typeDescriptorByI[def.typeParam];
    if (typeParamDescriptor) {
      descriptor.addNamedImport(typeParamDescriptor);
      return f.createArrayTypeNode(f.createTypeReferenceNode(typeParamDescriptor.nameIdent));
    } else {
      const typeParam = context.metadata.raw.types[def.typeParam];
      asserts.assert(typeParam);
      switch (typeParam.def._tag) {
        case m.TypeDefKind.Primitive: {
          return f.createArrayTypeNode(Primitive(typeParam.def));
        }
        case m.TypeDefKind.Tuple: {
          return f.createArrayTypeNode(Tuple(typeParam.def));
        }
        case m.TypeDefKind.Sequence: {
          return f.createArrayTypeNode(Sequence(typeParam.def));
        }
      }
    }
    return f.createArrayTypeNode(f.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword));
  };

  const Tuple = (def: m.TupleTypeDef): ts.TupleTypeNode => {
    return f.createTupleTypeNode(def.fields.map((field) => {
      const fieldTypeDescriptor = context.typeDescriptorByI[field];
      if (fieldTypeDescriptor) {
        descriptor.addNamedImport(fieldTypeDescriptor);
        return f.createTypeReferenceNode(fieldTypeDescriptor.nameIdent);
      } else {
        const fieldType = context.metadata.raw.types[field];
        asserts.assert(fieldType);
        switch (fieldType.def._tag) {
          case m.TypeDefKind.Primitive: {
            return Primitive(fieldType.def);
          }
          case m.TypeDefKind.Sequence: {
            return Sequence(fieldType.def);
          }
          case m.TypeDefKind.FixedLenArray: {
            return FixedLenArray(fieldType.def);
          }
          case m.TypeDefKind.Compact: {
            return f.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
          }
          case m.TypeDefKind.Tuple: {
            return Tuple(fieldType.def);
          }
          default: {
            asserts.unreachable();
          }
        }
      }
    }));
  };

  const Primitive = (def: m.PrimitiveTypeDef): ts.KeywordTypeNode => {
    switch (def.kind) {
      case m.PrimitiveTypeDefKind.I8:
      case m.PrimitiveTypeDefKind.I16:
      case m.PrimitiveTypeDefKind.I32:
      case m.PrimitiveTypeDefKind.I64:
      case m.PrimitiveTypeDefKind.I128:
      case m.PrimitiveTypeDefKind.I256:
      case m.PrimitiveTypeDefKind.U8:
      case m.PrimitiveTypeDefKind.U16:
      case m.PrimitiveTypeDefKind.U32:
      case m.PrimitiveTypeDefKind.U64:
      case m.PrimitiveTypeDefKind.U128:
      case m.PrimitiveTypeDefKind.U256: {
        return f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
      }
      case m.PrimitiveTypeDefKind.Bool: {
        return f.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
      }
      case m.PrimitiveTypeDefKind.Char:
      case m.PrimitiveTypeDefKind.Str: {
        return f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
      }
    }
  };

  switch (descriptor.raw.def._tag) {
    case m.TypeDefKind.Record: {
      return RootRecordType(descriptor as any /* TODO: create guards to narrow */);
    }
    case m.TypeDefKind.TaggedUnion: {
      // console.log(descriptor.sourceFilePath);
      return RootTaggedUnionType(descriptor as any /* TODO: create guards to narrow */);
    }
    default: {
      asserts.unreachable();
    }
  }
};
