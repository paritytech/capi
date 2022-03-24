import { Chain } from "/frame_codegen/Chain.ts";
import { nf } from "/frame_codegen/common.ts";
import { isNamedType, NamedType } from "/frame_codegen/NamedType.ts";
import { Type } from "/frame_codegen/Type.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class TypeBase<TypeDef extends m.TypeDef = m.TypeDef> {
  imports = new Map<NamedType, ts.Identifier>();

  constructor(
    readonly chain: Chain,
    readonly rawType: m.Type<TypeDef>,
  ) {}

  // TODO: fix this
  importPathFrom(type: Type): string {
    return path.relative(
      path.join(...type.rawType.path.slice(0, this.rawType.path.length - 2)),
      path.join(...this.rawType.path),
    ).split(path.sep).join("/").concat(".ts");
  }

  node(ctx: NamedType): ts.TypeNode {
    return this.#visit(ctx, this);
  }

  #visit(
    ctx: NamedType,
    type: Type,
  ): ts.TypeNode {
    if (isNamedType(type)) {
      if (type.name === "DisputeStatementSet") {
        console.log(type.rawType.path);
      }
      const ident = ctx.addImport(type);
      switch (type.rawType.def._tag) {
        case m.TypeDefKind.Record:
        case m.TypeDefKind.TaggedUnion: {
          const typeNodes = type.rawType.params.length > 0
            ? type.rawType.params.map((param) => {
              if (param.type) {
                const paramType = this.chain.getType(param.type);
                return this.#visit(ctx, paramType);
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
          return this.#visitArray(ctx, type.rawType.def);
        }
        case m.TypeDefKind.Compact: {
          return nf.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        }
        case m.TypeDefKind.Tuple: {
          return this.#visitTuple(ctx, type.rawType.def as m.TupleTypeDef);
        }
        case m.TypeDefKind.BitSequence: {
          return nf.createTypeReferenceNode("Uint8Array");
        }
        case m.TypeDefKind.Primitive: {
          return this.#visitPrimitive(type.rawType.def.kind);
        }
        case m.TypeDefKind.Record:
        case m.TypeDefKind.TaggedUnion: {
          asserts.unreachable();
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

  #visitArray(
    ctx: NamedType,
    type: m.FixedLenArrayTypeDef | m.SequenceTypeDef,
  ) {
    const elementType = this.chain.getType(type.typeParam);
    return nf.createArrayTypeNode(this.#visit(ctx, elementType));
  }

  #visitTuple(
    ctx: NamedType,
    type: m.TupleTypeDef,
  ) {
    return nf.createTupleTypeNode(type.fields.map((field) => {
      const type = this.chain.getType(field);
      return this.#visit(ctx, type);
    }));
  }
}
