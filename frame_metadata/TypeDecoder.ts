import { MetadataContainer } from "/frame_metadata/Container.ts";
import * as m from "/frame_metadata/V14.ts";
import { StorageTransformers } from "/frame_metadata/Visitor.ts";
import { Tagged } from "/scale/decode-patterns.ts";
import * as d from "/scale/decode.ts";
import * as asserts from "std/testing/asserts.ts";

const primitiveDecoders: {
  [_ in m.PrimitiveTypeDefKind]: d.AnyDecoder;
} = {
  [m.PrimitiveTypeDefKind.Bool]: d.bool,
  [m.PrimitiveTypeDefKind.Char]: d.str,
  [m.PrimitiveTypeDefKind.Str]: d.str,
  [m.PrimitiveTypeDefKind.U8]: d.u8,
  [m.PrimitiveTypeDefKind.U16]: d.u16,
  [m.PrimitiveTypeDefKind.U32]: d.u32,
  [m.PrimitiveTypeDefKind.U64]: d.u64,
  [m.PrimitiveTypeDefKind.U128]: d.u128,
  [m.PrimitiveTypeDefKind.U256]: d.u256,
  [m.PrimitiveTypeDefKind.I8]: d.i8,
  [m.PrimitiveTypeDefKind.I16]: d.i16,
  [m.PrimitiveTypeDefKind.I32]: d.i32,
  [m.PrimitiveTypeDefKind.I64]: d.i64,
  [m.PrimitiveTypeDefKind.I128]: d.i128,
  [m.PrimitiveTypeDefKind.I256]: d.i256,
};

export const FrameTypeDecoder = (
  metadata: MetadataContainer,
  typeI: number,
): d.UnknownDecoder => {
  const decodeFields = (fields: m.Field[]): d.AnyRecordField[] => {
    return fields.map((field, i) => {
      return d.RecordField(field.name === undefined ? i : field.name, TyIDecoder(field.type));
    });
  };

  const factories: StorageTransformers<{ [_ in m.TypeDefKind]: d.AnyDecoder }> = {
    [m.TypeDefKind.Record](typeDef) {
      return d.Record(...decodeFields(typeDef.fields));
    },

    [m.TypeDefKind.TaggedUnion](typeDef) {
      return d.Union(
        ...typeDef.members.map((member) => {
          return Tagged(member.name, ...decodeFields(member.fields || []));
        }),
      );
    },

    [m.TypeDefKind.Sequence](typeDef) {
      return d.Tuple(TyIDecoder(typeDef.typeParam));
    },

    [m.TypeDefKind.FixedLenArray](typeDef) {
      return d.FixedSizeArray(TyIDecoder(typeDef.typeParam), typeDef.len);
    },

    [m.TypeDefKind.Tuple](typeDef) {
      return d.Tuple(...typeDef.fields.map(TyIDecoder));
    },

    [m.TypeDefKind.Primitive](typeDef) {
      return primitiveDecoders[typeDef.kind];
    },

    [m.TypeDefKind.Compact](_typeDef) {
      asserts.unimplemented();
    },

    [m.TypeDefKind.BitSequence](_typeDef) {
      asserts.unimplemented();
    },
  };

  const TyIDecoder = (i: number): d.AnyDecoder => {
    const ty = metadata.raw.types[i];
    asserts.assert(ty);
    return (factories[ty.def._tag] as any)(ty.def);
  };

  return TyIDecoder(typeI);
};
