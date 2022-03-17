import { comment, f, Factory } from "/codegen/common.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

type RecordStatements = [ts.InterfaceDeclaration];
type TaggedUnionStatements = [ts.TypeAliasDeclaration, ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | []];

type TransformerResultByKind = m.EnsureAllTypeDefKindsAccountedFor<{
  [m.TypeDefKind.Record]: RecordStatements;
  [m.TypeDefKind.TaggedUnion]: TaggedUnionStatements;
  [m.TypeDefKind.Sequence]: never;
  [m.TypeDefKind.FixedLenArray]: never;
  [m.TypeDefKind.Tuple]: never;
  [m.TypeDefKind.Primitive]: never;
  [m.TypeDefKind.Compact]: never;
  [m.TypeDefKind.BitSequence]: never;
}>;

export const Type = (
  name: string,
  type: m.Type,
  metadata: m.MetadataContainer,
): Factory<[ts.VariableStatement]> => {
  return (_config) => {
    return ((<m.StorageTransformers<TransformerResultByKind>> {
      [m.TypeDefKind.Record]: RecordStatements,
      [m.TypeDefKind.TaggedUnion]: TaggedUnionStatements,
      [m.TypeDefKind.Sequence]: asserts.unreachable,
      [m.TypeDefKind.FixedLenArray]: asserts.unreachable,
      [m.TypeDefKind.Tuple]: asserts.unreachable,
      [m.TypeDefKind.Primitive]: asserts.unreachable,
      [m.TypeDefKind.Compact]: asserts.unreachable,
      [m.TypeDefKind.BitSequence]: asserts.unreachable,
    })[type.def._tag] as any)(type.def);

    function RecordStatements(def: m.RecordTypeDef): RecordStatements {
      const interfaceDecl = f.createInterfaceDeclaration(
        undefined,
        [f.createModifier(ts.SyntaxKind.ExportKeyword)],
        f.createIdentifier(name),
        undefined,
        undefined,
        def.fields.map((field, i) => {
          const name = field.name || i.toString();
          const propertySignature = PropertySignature(name, f.createLiteralTypeNode(f.createStringLiteral("TODO")));
          comment(propertySignature, field.docs.join("\n"));
          return propertySignature;
        }) || [],
      );
      if (type.docs) {
        comment(interfaceDecl, type.docs.join("\n"));
      }
      return [interfaceDecl];
    }

    function TaggedUnionStatements(def: m.TaggedUnionTypeDef): TaggedUnionStatements {
      const typeIdent = f.createIdentifier(name);

      // Rust enums with no members are equivalent to `never` in TypeScript.
      if (def.members.length === 0) {
        return [f.createTypeAliasDeclaration(
          undefined,
          [f.createModifier(ts.SyntaxKind.ExportKeyword)],
          typeIdent,
          undefined,
          f.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
        )];
      }

      const variantDeclarations: ts.InterfaceDeclaration[] = [];
      const unionMemberIdents: ts.Identifier[] = [];
      const tagEnumMembers: ts.EnumMember[] = [];
      const tagEnumIdent = f.createIdentifier(`${name}Tag`);

      def.members.forEach(
        (member) => {
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
              ...member.fields?.map((field, i) => {
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
        },
      );

      const unionDeclaration = f.createTypeAliasDeclaration(
        undefined,
        [f.createModifier(ts.SyntaxKind.ExportKeyword)],
        typeIdent,
        undefined,
        f.createUnionTypeNode(unionMemberIdents.map((x) => {
          return f.createTypeReferenceNode(x, undefined);
        })),
      );
      if (type.docs) {
        comment(unionDeclaration, type.docs.join("\n"));
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
};

const PropertySignature = (key: string, type: ts.TypeReferenceNode | ts.LiteralTypeNode) => {
  return f.createPropertySignature(undefined, f.createIdentifier(key), undefined, type);
};
