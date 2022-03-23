import { comment, f, PropertySignature } from "/codegen/common.ts";
import { FrameContext, FrameTypeDescriptor } from "/codegen/frame/Context.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

type RecordStatements = [ts.InterfaceDeclaration];
type TaggedUnionStatements = [ts.TypeAliasDeclaration, ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | []];
type Digest = RecordStatements | TaggedUnionStatements;

type TypeDecoderVisitor = Omit<
  m.TypeDefVisitor<{
    [m.TypeDefKind.Record]: never;
    [m.TypeDefKind.TaggedUnion]: never;
    [m.TypeDefKind.Sequence]: ts.ArrayTypeNode;
    [m.TypeDefKind.FixedLenArray]: ts.ArrayTypeNode;
    [m.TypeDefKind.Tuple]: ts.TupleTypeNode;
    [m.TypeDefKind.Primitive]: ts.KeywordTypeNode;
    [m.TypeDefKind.Compact]: ts.KeywordTypeNode;
    [m.TypeDefKind.BitSequence]: ts.TypeReferenceNode;
  }>,
  m.TypeDefKind.Record | m.TypeDefKind.TaggedUnion | m.TypeDefKind.Compact
>;

export class Type implements TypeDecoderVisitor {
  #typeDescriptorByI;
  #types;

  constructor(
    context: FrameContext,
    private descriptor: FrameTypeDescriptor<m.RecordTypeDef | m.TaggedUnionTypeDef>,
  ) {
    this.#typeDescriptorByI = context.typeDescriptorByI;
    this.#types = context.metadata.raw.types;
  }

  digest(): Digest {
    switch (this.descriptor.raw.def._tag) {
      case m.TypeDefKind.Record: {
        return this.Record(this.descriptor as any /* TODO: create guards to narrow */);
      }
      case m.TypeDefKind.TaggedUnion: {
        // console.log(descriptor.sourceFilePath);
        return this.TaggedUnion(this.descriptor as any /* TODO: create guards to narrow */);
      }
      default: {
        asserts.unreachable();
      }
    }
  }

  visit(def: m.TypeDef, i: number): ts.TypeNode {
    switch (def._tag) {
      case m.TypeDefKind.FixedLenArray: {
        return this.FixedLenArray(def);
      }
      case m.TypeDefKind.Primitive: {
        return this.Primitive(def);
      }
      case m.TypeDefKind.Sequence: {
        return this.Sequence(def);
      }
      case m.TypeDefKind.Compact: {
        return f.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
      }
      case m.TypeDefKind.Tuple: {
        return this.Tuple(def);
      }
      case m.TypeDefKind.BitSequence: {
        return this.BitSequence(def);
      }
      case m.TypeDefKind.TaggedUnion:
      case m.TypeDefKind.Record: {
        return this.TypeReference(i);
      }
    }
  }

  Record(descriptor: FrameTypeDescriptor<m.RecordTypeDef>): RecordStatements {
    const interfaceDecl = f.createInterfaceDeclaration(
      undefined,
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      descriptor.nameIdent,
      undefined,
      undefined,
      descriptor.raw.def.fields.map((field, i) => {
        const fieldType = this.#types[field.type];
        asserts.assert(fieldType);
        const fieldTypeNode = this.visit(fieldType.def, field.type);
        const propertySignature = PropertySignature(field.name || i.toString(), fieldTypeNode);
        comment(propertySignature, field.docs.join("\n"));
        return propertySignature;
      }) || [],
    );
    if (descriptor.raw.docs) {
      comment(interfaceDecl, descriptor.raw.docs.join("\n"));
    }
    return [interfaceDecl];
  }

  // TODO: this is likely NOT what the conversion is meant to be –– do we need to implement a `BitSequence`-specific structure?
  BitSequence(_def: m.BitSequenceTypeDef): ts.TypeReferenceNode {
    return f.createTypeReferenceNode(f.createIdentifier("Uint8Array"));
  }

  TypeReference(i: number): ts.TypeReferenceNode {
    const referencedTypeDesc = this.#typeDescriptorByI[i];
    asserts.assert(referencedTypeDesc);
    this.descriptor.importType(referencedTypeDesc);
    return f.createTypeReferenceNode(referencedTypeDesc.nameIdent);
  }

  TaggedUnion(descriptor: FrameTypeDescriptor<m.TaggedUnionTypeDef>): TaggedUnionStatements {
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
            const fieldType = this.#types[field.type];
            asserts.assert(fieldType);
            const fieldTypeNode = PropertySignature(field.name || i.toString(), this.visit(fieldType.def, field.type));
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
  }

  FixedLenArray(def: m.FixedLenArrayTypeDef): ts.ArrayTypeNode {
    const elementType = this.#types[def.typeParam];
    asserts.assert(elementType);
    return f.createArrayTypeNode(this.visit(elementType.def, def.typeParam));
  }

  Sequence(def: m.SequenceTypeDef): ts.ArrayTypeNode {
    const typeParam = this.#types[def.typeParam];
    asserts.assert(typeParam);
    return f.createArrayTypeNode(this.visit(typeParam.def, def.typeParam));
  }

  Tuple(def: m.TupleTypeDef): ts.TupleTypeNode {
    return f.createTupleTypeNode(def.fields.map((field) => {
      const typeParam = this.#types[field];
      asserts.assert(typeParam);
      return this.visit(typeParam.def, field);
    }));
  }

  Primitive(def: m.PrimitiveTypeDef): ts.KeywordTypeNode {
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
  }
}
