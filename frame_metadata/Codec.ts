import * as $ from "../deps/scale.ts";
import { $era } from "./Era.ts";
import type * as M from "./mod.ts";
import { TyVisitor } from "./TyVisitor.ts";

export type DeriveCodec = (typeI: number) => $.Codec<unknown>;

/**
 * All derived codecs for ZSTs will use this exact codec,
 * so `derivedCodec === $null` is true iff the type is a ZST.
 */
export const $null = $.dummy(null);

// TODO: tuple/array element skip optimization
export function DeriveCodec(tys: M.Ty[]): DeriveCodec {
  const visitor = new TyVisitor<$.Codec<any>>(tys, {
    unitStruct() {
      return $null;
    },
    wrapperStruct(_ty, inner) {
      return this.visit(inner);
    },
    tupleStruct(_ty, members) {
      return $.tuple(...members.map((x) => this.visit(x)));
    },
    objectStruct(ty) {
      return $.object(...ty.fields.map((x): $.Field => [x.name!, this.visit(x.ty)]));
    },
    option(_ty, some) {
      return $.option(this.visit(some));
    },
    result(_ty, ok, err) {
      return $.result(this.visit(ok), $.instance(ChainError, ["value", this.visit(err)]));
    },
    never() {
      return $.never as any;
    },
    stringUnion(ty) {
      const members: Record<number, string> = {};
      for (const { index, name } of ty.members) {
        members[index] = name;
      }
      return $.stringUnion(members);
    },
    taggedUnion(ty) {
      const members: Record<number, $.TaggedUnionMember> = {};
      for (const { fields, name: type, index } of ty.members) {
        let member: $.TaggedUnionMember;
        if (fields.length === 0) {
          member = [type];
        } else if (fields[0]!.name === undefined) {
          // Tuple variant
          const $value = fields.length === 1
            ? this.visit(fields[0]!.ty)
            : $.tuple(...fields.map((f) => this.visit(f.ty)));
          member = [type, ["value", $value]];
        } else {
          // Object variant
          const memberFields = fields.map((field, i) => {
            return [
              field.name || i,
              $.deferred(() => {
                return this.visit(field.ty);
              }),
            ] as [string, $.Codec<unknown>];
          });
          member = [type, ...memberFields];
        }
        members[index] = member;
      }
      return $.taggedUnion("type", members);
    },
    uint8array() {
      return $.uint8array;
    },
    array(ty) {
      return $.array(this.visit(ty.typeParam));
    },
    sizedUint8Array(ty) {
      return $.sizedUint8array(ty.len);
    },
    sizedArray(ty) {
      return $.sizedArray(this.visit(ty.typeParam), ty.len);
    },
    primitive(ty) {
      if (ty.kind === "char") return $.str;
      return $[ty.kind];
    },
    compact(ty) {
      const inner = this.visit(ty.typeParam);
      return compactCodecVisitor.visit(inner);
    },
    bitSequence() {
      return $.bitSequence;
    },
    map(_ty, key, val) {
      return $.map(this.visit(key), this.visit(val));
    },
    set(_ty, val) {
      return $.set(this.visit(val));
    },
    era() {
      return $era;
    },
    circular(ty) {
      return $.deferred(() => this.cache[ty.id]!);
    },
  });

  return (i: number) => visitor.visit(i);
}

export class ChainError<T> extends Error {
  constructor(readonly value: T) {
    super();
  }
}

const compactCodecVisitor = new $.CodecVisitor<$.Codec<any>>()
  .add($null, () => $null)
  .add($.u8, () => $.compactU8)
  .add($.u16, () => $.compactU16)
  .add($.u32, () => $.compactU32)
  .add($.u64, () => $.compactU64)
  .add($.u128, () => $.compactU128)
  .add($.u256, () => $.compactU256);
