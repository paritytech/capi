import * as $ from "x/scale/mod.ts";
import { display } from "./Display.ts";
import * as M from "./Metadata.ts";
import { TypeVisitors } from "./TypeVisitor.ts";

export type DeriveCodec = (typeI: number) => $.Codec<unknown>;

const primitiveCodecByDiscriminant = {
  [M.PrimitiveKind.Bool]: $.bool,
  [M.PrimitiveKind.Char]: $.str,
  [M.PrimitiveKind.Str]: $.str,
  [M.PrimitiveKind.U8]: $.u8,
  [M.PrimitiveKind.I8]: $.i8,
  [M.PrimitiveKind.U16]: $.u16,
  [M.PrimitiveKind.I16]: $.i16,
  [M.PrimitiveKind.U32]: $.u32,
  [M.PrimitiveKind.I32]: $.i32,
  [M.PrimitiveKind.U64]: $.u64,
  [M.PrimitiveKind.I64]: $.i64,
  [M.PrimitiveKind.U128]: $.u128,
  [M.PrimitiveKind.I128]: $.i128,
  [M.PrimitiveKind.U256]: $.u256,
  [M.PrimitiveKind.I256]: $.i256,
};

export const DeriveCodec = (metadata: M.Metadata): DeriveCodec => {
  const Fields = (...fields: M.Field[]): $.Field[] => {
    return fields.map((field, i) => {
      return [field.name === undefined ? i : field.name, visitors.visit(field.type)];
    });
  };

  const visitors: TypeVisitors<{ [_ in M.TypeKind]: $.Codec<any> }, never> = {
    [M.TypeKind.Struct]: (ty) => {
      return $.object(...Fields(...ty.fields)) as unknown as $.Codec<unknown>;
    },
    [M.TypeKind.Union]: (ty) => {
      // TODO: revisit this
      if (ty.path[0] === "Option") {
        return $.option(visitors.visit(ty.params[0]?.type!));
      }
      const memberIByTag: Record<string, number> = {};
      const memberIByDiscriminant: Record<number, number> = {};
      return union(
        (member) => {
          const discriminant = memberIByTag[member._tag];
          if (discriminant === undefined) {
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
          const memberFields = member.fields.map((field, i) => {
            return [field.name || i, visitors.visit(field.type)] as [string, $.Codec<unknown>];
          });
          return $.object(["_tag", $.dummy(member.name)], ...memberFields);
        }),
      ) as unknown as $.Codec<any>;
    },
    [M.TypeKind.Sequence]: (ty) => {
      return $.array(visitors.visit(ty.typeParam));
    },
    [M.TypeKind.SizedArray]: (ty) => {
      return $.sizedArray(visitors.visit(ty.typeParam), ty.len);
    },
    [M.TypeKind.Tuple]: (ty) => {
      return $.tuple(...ty.fields.map(visitors.visit));
    },
    [M.TypeKind.Primitive]: (ty) => {
      return primitiveCodecByDiscriminant[ty.kind]!;
    },
    [M.TypeKind.Compact]: () => {
      return $.compact;
    },
    [M.TypeKind.BitSequence]: () => {
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
