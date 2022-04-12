import { nf } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/type/Named.ts";
import { toAst } from "/frame_codegen/type/toAst.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";
import { pascalCase } from "x/case/mod.ts";
import { camelCase } from "x/case/mod.ts";

export type TaggedUnionStatements = [
  ts.TypeAliasDeclaration,
  ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | [],
];

export class TaggedUnionType extends NamedType<
  m.TaggedUnionTypeDef,
  TaggedUnionStatements
> {
  get statements(): TaggedUnionStatements {
    if (this.rawType.def.members.length === 0) {
      return [nf.createTypeAliasDeclaration(
        undefined,
        [nf.createModifier(ts.SyntaxKind.ExportKeyword)],
        this.nameIdent,
        undefined,
        nf.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
      )];
    }

    const tagEnumIdent = nf.createIdentifier(`${this.name}Tag`);

    const variants: ts.InterfaceDeclaration[] = [];
    const unionMemberNames: string[] = [];
    const tagEnumMembers: ts.EnumMember[] = [];

    this.rawType.def.members.forEach((member) => {
      const memberName = pascalCase(member.name);
      tagEnumMembers.push(nf.createEnumMember(memberName, nf.createStringLiteral(memberName)));
      unionMemberNames.push(memberName);
      const propertySignatures = member.fields.map(this.FieldPropertySignature);
      const variant = nf.createInterfaceDeclaration(
        undefined,
        [nf.createModifier(ts.SyntaxKind.ExportKeyword)],
        memberName,
        undefined,
        undefined,
        [
          nf.createPropertySignature(
            undefined,
            "_tag",
            undefined,
            nf.createTypeReferenceNode(nf.createQualifiedName(tagEnumIdent, memberName), undefined),
          ),
          ...propertySignatures,
        ],
      );
      variants.push(variant);
    });

    const unionDecl = nf.createTypeAliasDeclaration(
      undefined,
      [nf.createModifier(ts.SyntaxKind.ExportKeyword)],
      this.nameIdent,
      undefined,
      nf.createUnionTypeNode(unionMemberNames.map((ident) => {
        return nf.createTypeReferenceNode(ident);
      })),
    );

    const tagEnumDecl = nf.createEnumDeclaration(
      undefined,
      [nf.createModifier(ts.SyntaxKind.ExportKeyword), nf.createModifier(ts.SyntaxKind.ConstKeyword)],
      tagEnumIdent,
      tagEnumMembers,
    );

    return [unionDecl, tagEnumDecl, ...variants];
  }
}
