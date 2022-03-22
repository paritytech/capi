import { comment, f, PropertySignature } from "/codegen/common.ts";
import { FrameContext, FrameTypeDescriptor } from "/codegen/frame/Context.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

type RecordStatements = [ts.InterfaceDeclaration];
type TaggedUnionStatements = [ts.TypeAliasDeclaration, ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | []];
type PrimitiveStatements = [
  ts.KeywordTypeNode<ts.SyntaxKind.NumberKeyword | ts.SyntaxKind.BooleanKeyword | ts.SyntaxKind.StringKeyword>,
];

type TransformerResultByKind = m.EnsureAllTypeDefKindsAccountedFor<{
  [m.TypeDefKind.Record]: RecordStatements;
  [m.TypeDefKind.TaggedUnion]: TaggedUnionStatements;
  [m.TypeDefKind.Sequence]: never;
  [m.TypeDefKind.FixedLenArray]: never;
  [m.TypeDefKind.Tuple]: never;
  [m.TypeDefKind.Primitive]: PrimitiveStatements;
  [m.TypeDefKind.Compact]: [ts.KeywordTypeNode<ts.SyntaxKind.NumberKeyword>];
  [m.TypeDefKind.BitSequence]: never;
}>;

export const Type = (
  context: FrameContext,
  descriptor: FrameTypeDescriptor,
): ts.VariableStatement => {
  const typeNameIdent = f.createIdentifier(descriptor.name);

  return ((<m.StorageTransformers<TransformerResultByKind>> {
    [m.TypeDefKind.Record]: RecordStatements,
    [m.TypeDefKind.TaggedUnion]: TaggedUnionStatements,
    [m.TypeDefKind.Sequence]: asserts.unreachable,
    [m.TypeDefKind.FixedLenArray]: asserts.unreachable,
    [m.TypeDefKind.Tuple]: asserts.unreachable,
    [m.TypeDefKind.Primitive]: Primitive,
    [m.TypeDefKind.Compact]: () => [f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)],
    [m.TypeDefKind.BitSequence]: asserts.unreachable,
  })[descriptor.raw.def._tag] as any)(descriptor.raw.def);

  function Primitive(def: m.PrimitiveTypeDef): PrimitiveStatements {
    return [(() => {
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
    })()];
  }

  function RecordStatements(def: m.RecordTypeDef): RecordStatements {
    const interfaceDecl = f.createInterfaceDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      typeNameIdent,
      undefined,
      undefined,
      def.fields.map((field, i) => {
        const name = field.name || i.toString();
        const propertySignature = PropertySignature(name, f.createLiteralTypeNode(f.createStringLiteral("TODO")));
        comment(propertySignature, field.docs.join("\n"));
        return propertySignature;
      }) || [],
    );
    if (descriptor.raw.docs) {
      comment(interfaceDecl, descriptor.raw.docs.join("\n"));
    }
    return [interfaceDecl];
  }

  function TaggedUnionStatements(def: m.TaggedUnionTypeDef): TaggedUnionStatements {
    // Rust enums with no members are equivalent to `never` in TypeScript.
    if (def.members.length === 0) {
      return [f.createTypeAliasDeclaration(
        undefined,
        [f.createModifier(ts.SyntaxKind.ExportKeyword)],
        typeNameIdent,
        undefined,
        f.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
      )];
    }

    const variantDeclarations: ts.InterfaceDeclaration[] = [];
    const unionMemberIdents: ts.Identifier[] = [];
    const tagEnumMembers: ts.EnumMember[] = [];
    const tagEnumIdent = f.createIdentifier(`${descriptor.name}Tag`);

    def.members.forEach((member) => {
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
            const prop = PropertySignature(
              field.name || i.toString(),
              f.createLiteralTypeNode(f.createStringLiteral("TODO")),
            );
            comment(prop, field.docs.join("\n"));
            return prop;
          }) || [],
        ],
      );
      if (member.docs) {
        comment(decl, member.docs.join("\n"));
      }
      variantDeclarations.push(decl);
    });

    const unionDeclaration = f.createTypeAliasDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      typeNameIdent,
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
  }
};
