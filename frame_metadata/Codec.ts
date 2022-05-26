import * as $ from "x/scale/mod.ts";
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
  [m.PrimitiveKind.U256]: $.u256,
  [m.PrimitiveKind.I256]: $.i256,
};

export const DeriveCodec = (metadata: m.Metadata): DeriveCodec => {
  const Fields = (...fields: m.Field[]): $.Field[] => {
    return fields.map((field, i) => {
      return [field.name === undefined ? i : field.name, visitors.visit(field.type)];
    });
  };

  const visitors: TypeVisitors<{ [_ in m.TypeKind]: $.Codec<any> }, never> = {
    [m.TypeKind.Struct]: (ty) => {
      return $.object(...Fields(...ty.fields)) as unknown as $.Codec<unknown>;
    },
    [m.TypeKind.Union]: (ty) => {
      // TODO: revisit this
      if (ty.path[0] === "Option") {
        return $.option(visitors.visit(ty.params[0]?.type!));
      }
      const memberIByTag: Record<string, number> = {};
      const memberIByDiscriminant: Record<number, number> = {};
      return union(
        (member) => {
          const discriminant = memberIByTag[member._tag];
          if (!discriminant) {
            throw new Error("TODO");
          }
          return discriminant;
        },
        (discriminant) => {
          const i = memberIByDiscriminant[discriminant];
          if (i === undefined) {
            throw new Error("TODO");
          }
          return i;
        },
        ...ty.members.map((member, i) => {
          memberIByTag[member.name] = member.i;
          memberIByDiscriminant[member.i] = i;
          // if (ty.i === 17) {
          //   console.log(member.name, member.i);
          // }
          const memberFields = member.fields.map((field, i) => {
            return [field.name || i.toString(), visitors.visit(field.type)] as [string, $.Codec<unknown>];
          });
          return $.object(["_tag", $.dummy(member.name)], ...memberFields);
        }),
      ) as unknown as $.Codec<any>;
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
      if (i === 103) {
        return $.dummy("TODO XCM STUFF");
      }
      const type_ = metadata.types[i]!;
      return (visitors[type_._tag] as any)(type_);
    },
  };

  return visitors.visit;
};

type NativeUnion<MemberCodecs extends $.Codec<any>[]> = $.Native<MemberCodecs[number]>;

// TODO: get rid of this upon fixing in SCALE impl
function union<Members extends $.Codec<any>[]>(
  discriminate: (value: NativeUnion<Members>) => number,
  getIndexOfDiscriminant: (discriminant: number) => number,
  ...$members: [...Members]
) {
  return $.createCodec<NativeUnion<Members>>({
    _staticSize: 1 + Math.max(...$members.map((x) => x._staticSize)),
    _encode(buffer, value) {
      const discriminant = discriminate(value);
      buffer.array[buffer.index++] = discriminant;
      const $member = $members[discriminant]!;
      $member._encode(buffer, value);
    },
    _decode(buffer) {
      const discriminant = buffer.array[buffer.index++]!;
      const indexOfDiscriminant = getIndexOfDiscriminant(discriminant);
      const $member = $members[indexOfDiscriminant];
      if (!$member) {
        throw new Error(`No such member codec matching the discriminant \`${discriminant}\``);
      }
      return $member._decode(buffer);
    },
  });
}
