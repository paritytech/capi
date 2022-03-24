import { Chain } from "/frame_codegen/Chain.ts";
import { nf } from "/frame_codegen/common.ts";
import { isNamedType } from "/frame_codegen/NamedType.ts";
import { Type } from "/frame_codegen/Type.ts";
import { TypeBase } from "/frame_codegen/TypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class AnonymousType extends TypeBase<Exclude<m.TypeDef, m.NamedTypeDef>> {
  get node(): ts.TypeNode {
    return this.#visit(this);
  }

  #visit(type: Type): ts.TypeNode {
    if (isNamedType(type)) {
      if (type.name === "DisputeStatementSet") {
        console.log(type.rawType.path);
      }
      const ident = this.addImport(type);
      // console.log(type.rawType.params);
      switch (type.rawType.def._tag) {
        case m.TypeDefKind.Record:
        case m.TypeDefKind.TaggedUnion: {
          const typeNodes = type.rawType.params.length > 0
            ? type.rawType.params.map((param) => {
              if (param.type) {
                const paramType = this.chain.getType(param.type);
                return this.#visit(paramType);
              } else {
                return nf.createTypeReferenceNode(param.name);
              }
            })
            : undefined;
          return nf.createTypeReferenceNode(ident, typeNodes);
        }
      }
    } else {
      switch (type.rawType.def._tag) {
        case m.TypeDefKind.FixedLenArray:
        case m.TypeDefKind.Sequence: {
          return this.#visitArray(type.rawType.def);
        }
        case m.TypeDefKind.Compact: {
          return nf.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        }
        case m.TypeDefKind.Tuple: {
          return this.#visitTuple(type.rawType.def as m.TupleTypeDef);
        }
        case m.TypeDefKind.BitSequence: {
          return nf.createTypeReferenceNode("Uint8Array");
        }
        case m.TypeDefKind.Primitive: {
          return this.#visitPrimitive(type.rawType.def.kind);
        }
      }
    }
  }

  #visitPrimitive(kind: m.PrimitiveTypeDefKind) {
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
  }

  #visitArray(type: m.FixedLenArrayTypeDef | m.SequenceTypeDef) {
    const elementType = this.chain.getType(type.typeParam);
    return nf.createArrayTypeNode(this.#visit(elementType));
  }

  #visitTuple(type: m.TupleTypeDef) {
    return nf.createTupleTypeNode(type.fields.map((field) => {
      const type = this.chain.getType(field);
      return this.#visit(type);
    }));
  }
}
