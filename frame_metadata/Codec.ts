import * as $ from "../_deps/scale.ts";
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

/**
 * All derived codecs for ZSTs will use this exact codec,
 * so `derivedCodec === $null` is true iff the type is a ZST.
 */
export const $null = $.dummy(null);

export const DeriveCodec = (metadata: M.Metadata): DeriveCodec => {
  // TODO: don't leak memory!
  const cache: Record<number, $.Codec<unknown> | null> = {};

  function tuple(fields: number[]): $.Codec<any> {
    if (fields.length === 0) {
      return $null;
    } else if (fields.length === 1) {
      return visitors.visit(fields[0]!);
    } else {
      return $.tuple(...fields.map((field) => visitors.visit(field)));
    }
  }

  const visitors: TypeVisitors<{ [_ in M.TypeKind]: $.Codec<any> }> = {
    [M.TypeKind.Struct]: (ty) => {
      if (ty.fields.length === 0) {
        return $null;
      } else if (ty.fields[0]!.name === undefined) {
        // Tuple struct
        return tuple(ty.fields.map((f) => f.type));
      } else {
        // Object struct
        return $.object(
          ...ty.fields.map((field): $.Field => [field.name!, visitors.visit(field.type)]),
        );
      }
    },
    [M.TypeKind.Union]: (ty) => {
      // TODO: revisit this
      if (ty.path[0] === "Option") {
        return $.option(visitors.visit(ty.params[0]?.type!));
      }
      if (ty.members.length === 0) return $.never as any;
      const allEmpty = ty.members.every((x) => !x.fields.length);
      const memberIByTag: Record<string, number> = {};
      const memberIByDiscriminant: Record<number, number> = {};
      const members = ty.members.map((member, i) => {
        memberIByTag[member.name] = member.i;
        memberIByDiscriminant[member.i] = i;
        const { fields, name: _tag } = member;
        if (fields.length === 0) {
          if (allEmpty) {
            return $.dummy(_tag);
          } else {
            return $.dummy({ _tag });
          }
        }
        if (fields[0]!.name === undefined) {
          // Tuple variant
          const $value = tuple(fields.map((f) => f.type));
          return $.transform(
            $value,
            ({ value }: { value: unknown }) => value,
            (value) => ({ _tag, value }),
          );
        } else {
          // Object variant
          const memberFields = member.fields.map((field, i) => {
            return [
              field.name || i,
              $.deferred(() => {
                return visitors.visit(field.type);
              }),
            ] as [string, $.Codec<unknown>];
          });
          return $.object(["_tag", $.dummy(member.name)], ...memberFields);
        }
      });
      return union(
        (member) => {
          const tag = typeof member === "string" ? member : member._tag;
          const discriminant = memberIByTag[tag];
          if (discriminant === undefined) {
            throw new Error(
              `Invalid tag ${JSON.stringify(tag)}, expected one of ${
                JSON.stringify(Object.keys(memberIByTag))
              }`,
            );
          }
          return discriminant;
        },
        (discriminant) => {
          const i = memberIByDiscriminant[discriminant];
          if (i === undefined) {
            throw new Error(
              `Invalid discriminant ${discriminant}, expected one of ${
                JSON.stringify(Object.keys(memberIByDiscriminant))
              }`,
            );
          }
          return i;
        },
        ...members,
      ) as unknown as $.Codec<any>;
    },
    [M.TypeKind.Sequence]: (ty) => {
      const $el = visitors.visit(ty.typeParam);
      if ($el === $.u8) {
        return $.uint8array;
      } else {
        return $.array($el);
      }
    },
    [M.TypeKind.SizedArray]: (ty) => {
      const $el = visitors.visit(ty.typeParam);
      if ($el === $.u8) {
        return $.sizedUint8array(ty.len);
      } else {
        return $.sizedArray($el, ty.len);
      }
    },
    [M.TypeKind.Tuple]: (ty) => {
      return tuple(ty.fields);
    },
    [M.TypeKind.Primitive]: (ty) => {
      return primitiveCodecByDiscriminant[ty.kind]!;
    },
    [M.TypeKind.Compact]: () => {
      return $.compact;
    },
    [M.TypeKind.BitSequence]: () => {
      return $.never as unknown as $.Codec<any>;
    },
    visit: (i) => {
      if (cache[i]) {
        return cache[i];
      }
      if (cache[i] === null) {
        return $.deferred(() => cache[i]!);
      }
      cache[i] = null; // circularity detection
      const type_ = metadata.types[i]!;
      const $codec = (visitors[type_._tag] as any)(type_, false);
      cache[i] = $codec;
      return $codec;
    },
  };

  return (i: number) => visitors.visit(i);
};

type NativeUnion<MemberCodecs extends $.Codec<any>[]> = $.Native<MemberCodecs[number]>;

// TODO: get rid of this upon fixing in SCALE impl
function union<Members extends $.Codec<any>[]>(
  discriminate: (value: NativeUnion<Members>) => number,
  getIndexOfDiscriminant: (discriminant: number) => number,
  ...members: [...Members]
) {
  return $.createCodec<NativeUnion<Members>>({
    _staticSize: 1 + Math.max(...members.map((x) => x._staticSize)),
    _encode(buffer, value) {
      const discriminant = discriminate(value);
      buffer.array[buffer.index++] = discriminant;
      const $member = members[discriminant]!;
      $member._encode(buffer, value);
    },
    _decode(buffer) {
      const discriminant = buffer.array[buffer.index++]!;
      const indexOfDiscriminant = getIndexOfDiscriminant(discriminant);
      const $member = members[indexOfDiscriminant];
      if (!$member) {
        throw new Error(`No such member codec matching the discriminant \`${discriminant}\``);
      }
      return $member._decode(buffer);
    },
  });
}
