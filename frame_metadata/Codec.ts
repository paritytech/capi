import * as $ from "../_deps/scale.ts";
import * as M from "./Metadata.ts";
import { TyVisitors } from "./TyVisitor.ts";

export type DeriveCodec = (typeI: number) => $.Codec<unknown>;

/**
 * All derived codecs for ZSTs will use this exact codec,
 * so `derivedCodec === $null` is true if the type is a ZST.
 */
export const $null = $.dummy(null);

// TODO: tuple/array element skip optimization
export function DeriveCodec(metadata: M.Metadata): DeriveCodec {
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

  const visitors: TyVisitors<{ [_ in M.TyType]: $.Codec<any> }> = {
    Struct: (ty) => {
      if (ty.fields.length === 0) {
        return $null;
      } else if (ty.fields[0]!.name === undefined) {
        // Tuple struct
        return tuple(ty.fields.map((f) => f.ty));
      } else {
        // Object struct
        return $.object(
          ...ty.fields.map((field): $.Field => [field.name!, visitors.visit(field.ty)]),
        );
      }
    },
    Union: (ty) => {
      // TODO: revisit this
      if (ty.path[0] === "Option") {
        return $.option(visitors.visit(ty.params[0]!.ty!));
      }
      if (ty.path[0] === "Result") {
        return $.result(
          visitors.visit(ty.params[0]!.ty!),
          $.instance(ChainError, ["value", visitors.visit(ty.params[1]!.ty!)]),
        );
      }
      if (ty.members.length === 0) return $.never as any;
      const allEmpty = ty.members.every((x) => !x.fields.length);
      const memberIByTag: Record<string, number> = {};
      const memberIByDiscriminant: Record<number, number> = {};
      const members = ty.members.map((member, i) => {
        memberIByTag[member.name] = member.i;
        memberIByDiscriminant[member.i] = i;
        const { fields, name: type } = member;
        if (fields.length === 0) {
          if (allEmpty) {
            return $.dummy(type);
          } else {
            return $.dummy({ type });
          }
        }
        if (fields[0]!.name === undefined) {
          // Tuple variant
          const $value = tuple(fields.map((f) => f.ty));
          return $.transform(
            $value,
            ({ value }: { value: unknown }) => value,
            (value) => ({ type, value }),
          );
        } else {
          // Object variant
          const memberFields = member.fields.map((field, i) => {
            return [
              field.name || i,
              $.deferred(() => {
                return visitors.visit(field.ty);
              }),
            ] as [string, $.Codec<unknown>];
          });
          return $.object(["type", $.dummy(member.name)], ...memberFields);
        }
      });
      return union(
        (member) => {
          const tag = typeof member === "string" ? member : member.type;
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
    Sequence: (ty) => {
      const $el = visitors.visit(ty.typeParam);
      if ($el === $.u8) {
        return $.uint8array;
      } else {
        return $.array($el);
      }
    },
    SizedArray: (ty) => {
      const $el = visitors.visit(ty.typeParam);
      if ($el === $.u8) {
        return $.sizedUint8array(ty.len);
      } else {
        return $.sizedArray($el, ty.len);
      }
    },
    Tuple: (ty) => {
      return tuple(ty.fields);
    },
    Primitive: (ty) => {
      if (ty.kind === "char") return $.str;
      return $[ty.kind];
    },
    Compact: () => {
      return $.compact;
    },
    BitSequence: () => {
      return $.bitSequence;
    },
    visit: (i) => {
      if (cache[i]) {
        return cache[i];
      }
      if (cache[i] === null) {
        return $.deferred(() => cache[i]!);
      }
      cache[i] = null; // circularity detection
      const ty = metadata.tys[i]!;
      const $codec = (visitors[ty.type] as any)(ty);
      cache[i] = $codec;
      return $codec;
    },
  };

  return (i: number) => visitors.visit(i);
}

type NativeUnion<MemberCodecs extends $.Codec<any>[]> = $.Native<MemberCodecs[number]>;

// TODO: get rid of this upon fixing in SCALE impl
function union<Members extends $.Codec<any>[]>(
  discriminate: (value: NativeUnion<Members>) => number,
  getIndexOfDiscriminant: (discriminant: number) => number,
  ...members: [...Members]
): $.Codec<NativeUnion<Members>> {
  return $.createCodec({
    _metadata: [union, discriminate, getIndexOfDiscriminant, ...members],
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

export class ChainError extends Error {
  constructor(readonly value: unknown) {
    super();
  }
}
