import { nf } from "/frame_codegen/common.ts";
import { Type } from "/frame_codegen/type/Base.ts";
import { NamedType } from "/frame_codegen/type/Named.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export const toAst = (
  root: NamedType,
  type: Type,
): ts.TypeNode => {
  switch (type.rawType.def._tag) {
    case m.TypeDefKind.FixedLenArray:
    case m.TypeDefKind.Sequence: {
      return visitArray(root, type.rawType.def);
    }
    case m.TypeDefKind.Compact: {
      return nf.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    }
    case m.TypeDefKind.Tuple: {
      return visitTuple(root, type.rawType.def as m.TupleTypeDef);
    }
    case m.TypeDefKind.BitSequence: {
      return nf.createTypeReferenceNode("Uint8Array");
    }
    case m.TypeDefKind.Primitive: {
      return visitPrimitive(type.rawType.def.kind);
    }
    case m.TypeDefKind.Record:
    case m.TypeDefKind.TaggedUnion: {
      asserts.assert(type instanceof NamedType);
      const ident = root.addImport(type);
      const typeNodes = type.rawType.params.length > 0
        ? type.rawType.params.map((param) => {
          if (param.type) {
            const paramType = root.chain.getType(param.type);
            return toAst(root, paramType);
          } else {
            return nf.createTypeReferenceNode(param.name);
          }
        })
        : undefined;
      return nf.createTypeReferenceNode(ident, typeNodes);
    }
  }
};

const visitPrimitive = (kind: m.PrimitiveTypeDefKind) => {
  switch (kind) {
    case m.PrimitiveTypeDefKind.U8:
    case m.PrimitiveTypeDefKind.U16:
    case m.PrimitiveTypeDefKind.U32:
    case m.PrimitiveTypeDefKind.U64:
    case m.PrimitiveTypeDefKind.U128:
    case m.PrimitiveTypeDefKind.U256:
    case m.PrimitiveTypeDefKind.I8:
    case m.PrimitiveTypeDefKind.I16:
    case m.PrimitiveTypeDefKind.I32:
    case m.PrimitiveTypeDefKind.I64:
    case m.PrimitiveTypeDefKind.I128:
    case m.PrimitiveTypeDefKind.I256: {
      return nf.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    }
    case m.PrimitiveTypeDefKind.Bool: {
      return nf.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    }
    case m.PrimitiveTypeDefKind.Char:
    case m.PrimitiveTypeDefKind.Str: {
      return nf.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    }
  }
};

const visitArray = (
  root: NamedType,
  type: m.FixedLenArrayTypeDef | m.SequenceTypeDef,
) => {
  const elementType = root.chain.getType(type.typeParam);
  return nf.createArrayTypeNode(toAst(root, elementType));
};

const visitTuple = (
  root: NamedType,
  type: m.TupleTypeDef,
) => {
  return nf.createTupleTypeNode(type.fields.map((field) => {
    const type = root.chain.getType(field);
    return toAst(root, type);
  }));
};
