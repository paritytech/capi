import * as s from "x/scale/mod.ts";
import * as m from "./Metadata.ts";
import { TypeVisitors } from "./TypeVisitor.ts";

export type DeriveCodec = (typeI: number) => s.Codec<unknown>;

const primitiveCodecByDiscriminant = {
  [m.PrimitiveKind.Bool]: s.bool,
  [m.PrimitiveKind.Char]: s.str,
  [m.PrimitiveKind.Str]: s.str,
  [m.PrimitiveKind.U8]: s.u8,
  [m.PrimitiveKind.I8]: s.i8,
  [m.PrimitiveKind.U16]: s.u16,
  [m.PrimitiveKind.I16]: s.i16,
  [m.PrimitiveKind.U32]: s.u32,
  [m.PrimitiveKind.I32]: s.i32,
  [m.PrimitiveKind.U64]: s.u64,
  [m.PrimitiveKind.I64]: s.i64,
  [m.PrimitiveKind.U128]: s.u128,
  [m.PrimitiveKind.I128]: s.i128,

  // TODO
  [m.PrimitiveKind.U256]: undefined,
  [m.PrimitiveKind.I256]: undefined,
};

export const DeriveCodec = (metadata: m.Metadata): DeriveCodec => {
  const Fields = (...fields: m.Field[]): s.Field[] => {
    return fields.map((field, i) => {
      return [field.name === undefined ? i : field.name, visitors.visit(field.type)];
    });
  };

  const visitors: TypeVisitors<{ [_ in m.TypeKind]: s.Codec }> = {
    [m.TypeKind.Struct]: (ty) => {
      return s.record(...Fields(...ty.fields)) as unknown as s.Codec;
    },
    [m.TypeKind.Union]: (ty) => {
      if (ty.path[0] === "Option") {
        return s.option(visitors.visit(ty.params[0]?.type!));
      }
      return s.dummy(undefined);
    },
    [m.TypeKind.Sequence]: (ty) => {
      return s.array(visitors.visit(ty.typeParam));
    },
    [m.TypeKind.SizedArray]: (ty) => {
      return s.sizedArray(visitors.visit(ty.typeParam), ty.len);
    },
    [m.TypeKind.Tuple]: (ty) => {
      return s.tuple(...ty.fields.map(visitors.visit));
    },
    [m.TypeKind.Primitive]: (ty) => {
      return primitiveCodecByDiscriminant[ty.kind]!;
    },
    [m.TypeKind.Compact]: () => {
      return s.compact;
    },
    [m.TypeKind.BitSequence]: () => {
      throw new Error();
    },
    visit: (i) => {
      const type_ = metadata.types[i]!;
      // console.log(type_);
      switch (type_._tag) {
        case m.TypeKind.Struct: {
          return visitors[m.TypeKind.Struct](type_);
        }
        case m.TypeKind.Union: {
          return visitors[m.TypeKind.Union](type_);
        }
        case m.TypeKind.Sequence: {
          return visitors[m.TypeKind.Sequence](type_);
        }
        case m.TypeKind.SizedArray: {
          return visitors[m.TypeKind.SizedArray](type_);
        }
        case m.TypeKind.Tuple: {
          return visitors[m.TypeKind.Tuple](type_);
        }
        case m.TypeKind.Primitive: {
          return visitors[m.TypeKind.Primitive](type_);
        }
        case m.TypeKind.Compact: {
          return visitors[m.TypeKind.Compact](type_);
        }
        case m.TypeKind.BitSequence: {
          return visitors[m.TypeKind.BitSequence](type_);
        }
      }
    },
  };

  return visitors.visit;
};
