import { $ } from "../barrel.ts";
import * as m from "./Metadata.ts";
import { TypeVisitors } from "./TypeVisitor.ts";

export type DeriveCodec = (typeI: number) => $.Codec<unknown>;

const primitiveCodecByDiscriminant = {
  [m.PrimitiveKind.Bool]: $.bool,
  [m.PrimitiveKind.Char]: $.str,
  [m.PrimitiveKind.Str]: $.str,
  [m.PrimitiveKind.U8]: $.u8,
  [m.PrimitiveKind.I8]: $.i8,
  [m.PrimitiveKind.U16]: $.u16,
  [m.PrimitiveKind.I16]: $.i16,
  [m.PrimitiveKind.U32]: $.u32,
  [m.PrimitiveKind.I32]: $.i32,
  [m.PrimitiveKind.U64]: $.u64,
  [m.PrimitiveKind.I64]: $.i64,
  [m.PrimitiveKind.U128]: $.u128,
  [m.PrimitiveKind.I128]: $.i128,

  // TODO
  [m.PrimitiveKind.U256]: $.u256,
  [m.PrimitiveKind.I256]: $.i256,
};

export const DeriveCodec = (metadata: m.Metadata): DeriveCodec => {
  const Fields = (...fields: m.Field[]): $.Field[] => {
    return fields.map((field, i) => {
      return [field.name === undefined ? i : field.name, visitors.visit(field.type)];
    });
  };

  const visitors: TypeVisitors<{ [_ in m.TypeKind]: $.Codec<any> }> = {
    [m.TypeKind.Struct]: (ty) => {
      return $.object(...Fields(...ty.fields)) as unknown as $.Codec<unknown>;
    },
    [m.TypeKind.Union]: (ty) => {
      if (ty.path[0] === "Option") {
        return $.option(visitors.visit(ty.params[0]?.type!));
      }
      return $.dummy(undefined);
    },
    [m.TypeKind.Sequence]: (ty) => {
      return $.array(visitors.visit(ty.typeParam));
    },
    [m.TypeKind.SizedArray]: (ty) => {
      return $.sizedArray(visitors.visit(ty.typeParam), ty.len);
    },
    [m.TypeKind.Tuple]: (ty) => {
      return $.tuple(...ty.fields.map(visitors.visit));
    },
    [m.TypeKind.Primitive]: (ty) => {
      return primitiveCodecByDiscriminant[ty.kind]!;
    },
    [m.TypeKind.Compact]: () => {
      return $.compact;
    },
    [m.TypeKind.BitSequence]: () => {
      throw new Error();
    },
    visit: (i) => {
      const type_ = metadata.types[i]!;
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
