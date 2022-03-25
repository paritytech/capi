// TODO: high priority

import { MetadataContainer } from "/frame_metadata/Container.ts";
import * as m from "/frame_metadata/V14.ts";
import { TypeDefVisitor } from "/frame_metadata/Visitor.ts";
import { Tagged } from "/scale/decode-patterns.ts";
import * as e from "/scale/encode.ts";
import * as asserts from "std/testing/asserts.ts";

const primitiveEncoders: {
  [_ in m.PrimitiveTypeDefKind]: e.AnyEncoder;
} = {
  [m.PrimitiveTypeDefKind.Bool]: e.bool,
  [m.PrimitiveTypeDefKind.Char]: e.str,
  [m.PrimitiveTypeDefKind.Str]: e.str,
  [m.PrimitiveTypeDefKind.U8]: e.u8,
  [m.PrimitiveTypeDefKind.U16]: e.u16,
  [m.PrimitiveTypeDefKind.U32]: e.u32,
  [m.PrimitiveTypeDefKind.U64]: e.u64,
  [m.PrimitiveTypeDefKind.U128]: e.u128,
  [m.PrimitiveTypeDefKind.U256]: e.u256,
  [m.PrimitiveTypeDefKind.I8]: e.i8,
  [m.PrimitiveTypeDefKind.I16]: e.i16,
  [m.PrimitiveTypeDefKind.I32]: e.i32,
  [m.PrimitiveTypeDefKind.I64]: e.i64,
  [m.PrimitiveTypeDefKind.I128]: e.i128,
  [m.PrimitiveTypeDefKind.I256]: e.i256,
};

export const FrameTypeEncoder = (
  metadata: MetadataContainer,
  typeI: number,
): e.UnknownEncoder => {
  return undefined as any;
  // const encodeFields = (fields: m.Field[]): e.AnyRecordField[] => {
  //   return fields.map((field, i) => {
  //     return e.RecordField(field.name === undefined ? i : field.name, TyIDecoder(field.type));
  //   });
  // };

  // const factories: StorageTransformers<{ [_ in m.TypeDefKind]: e.AnyDecoder }> = {
  //   [m.TypeDefKind.Record](typeDef) {
  //     return e.Record(...encodeFields(typeDef.fields));
  //   },

  //   [m.TypeDefKind.TaggedUnion](typeDef) {
  //     return e.Union(
  //       ...typeDef.members.map((member) => {
  //         return Tagged(member.name, ...encodeFields(member.fields));
  //       }),
  //     );
  //   },

  //   [m.TypeDefKind.Sequence](typeDef) {
  //     return e.Tuple(TyIDecoder(typeDef.typeParam));
  //   },

  //   [m.TypeDefKind.FixedLenArray](typeDef) {
  //     return e.FixedSizeArray(TyIDecoder(typeDef.typeParam), typeDef.len);
  //   },

  //   [m.TypeDefKind.Tuple](typeDef) {
  //     return e.Tuple(...typeDef.fields.map(TyIDecoder));
  //   },

  //   [m.TypeDefKind.Primitive](typeDef) {
  //     return primitiveDecoders[typeDef.kind];
  //   },

  //   [m.TypeDefKind.Compact](_typeDef) {
  //     asserts.unimplemented();
  //   },

  //   [m.TypeDefKind.BitSequence](_typeDef) {
  //     asserts.unimplemented();
  //   },
  // };

  // const TyIDecoder = (i: number): e.AnyDecoder => {
  //   const ty = metadata.types[i];
  //   asserts.assert(ty);
  //   return (factories[ty.def._tag] as any)(ty.def);
  // };

  // return TyIDecoder(typeI);
};
