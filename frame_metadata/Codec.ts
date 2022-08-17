import * as $ from "../deps/scale.ts";
import { taggedUnion } from "../deps/scale.ts";
import type * as M from "./mod.ts";
import { TyVisitors } from "./TyVisitor.ts";

export type DeriveCodec = (typeI: number) => $.Codec<unknown>;

/**
 * All derived codecs for ZSTs will use this exact codec,
 * so `derivedCodec === $null` is true iff the type is a ZST.
 */
export const $null = $.dummy(null);

// TODO: tuple/array element skip optimization
export function DeriveCodec(tys: M.Ty[]): DeriveCodec {
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
      if (allEmpty) {
        const members: Record<number, string> = {};
        for (const { index, name } of ty.members) {
          members[index] = name;
        }
        return $.stringUnion(members);
      }
      const members: Record<number, $.TaggedUnionMember> = {};
      for (const { fields, name: type, index } of ty.members) {
        let member: $.TaggedUnionMember;
        if (fields.length === 0) {
          member = [type];
        } else if (fields[0]!.name === undefined) {
          // Tuple variant
          const $value = tuple(fields.map((f) => f.ty));
          member = [type, ["value", $value]];
        } else {
          // Object variant
          const memberFields = fields.map((field, i) => {
            return [
              field.name || i,
              $.deferred(() => {
                return visitors.visit(field.ty);
              }),
            ] as [string, $.Codec<unknown>];
          });
          member = [type, ...memberFields];
        }
        members[index] = member;
      }
      return taggedUnion("type", members);
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
      const ty = tys[i]!;
      const $codec = (visitors[ty.type] as any)(ty);
      cache[i] = $codec;
      return $codec;
    },
  };

  return (i: number) => visitors.visit(i);
}

export class ChainError extends Error {
  constructor(readonly value: unknown) {
    super();
  }
}
