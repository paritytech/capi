import { UnionToIntersection } from "/_/util/mod.ts";
import * as asserts from "std/testing/asserts.ts";

export interface State {
  idx: number;
  bytes: Uint8Array;
}

export type SizedDecoder<Decoded> = (state: State, len: number) => Decoded;
export type Decoder<Decoded> = (state: State) => Decoded;
export type AnyDecoder = Decoder<any>;
export type UnknownDecoder = Decoder<unknown>;

export const run = <Decoded>(
  decoder: Decoder<Decoded>,
  bytes: Uint8Array,
): Decoded => {
  return decoder({
    idx: 0,
    bytes,
  });
};

export const unimplemented: Decoder<never> = () => {
  asserts.unimplemented();
};

export const byte: Decoder<number> = (state): number => {
  const byte = state.bytes[state.idx];
  asserts.assert(byte !== undefined);
  state.idx += 1;
  return byte;
};

export const bytes: SizedDecoder<Uint8Array> = (state, len) => {
  const beg = state.idx;
  state.idx += len;
  asserts.assert(state.bytes.length >= state.idx);
  return state.bytes.subarray(beg, state.idx);
};

export const u8 = byte;

export const u16: Decoder<number> = (state) => {
  return byte(state) + byte(state) * 2 ** 8;
};

export const u32: Decoder<number> = (state) => {
  return byte(state) + byte(state) * 2 ** 8 + byte(state) * 2 ** 16 + byte(state) * 2 ** 24;
};

export const u64: Decoder<bigint> = (state) => {
  return BigInt(u32(state)) + (BigInt(u32(state)) << 32n);
};

export const u128: Decoder<bigint> = (state) => {
  return u64(state) + (u64(state) << 64n);
};

export const u256: Decoder<bigint> = (state) => {
  return u128(state) + (u128(state) << 128n);
};

export const i8: Decoder<number> = (state) => {
  const b = byte(state);
  return b | (b & 2 ** 7) * 0x1fffffe;
};

export const i16: Decoder<number> = (state) => {
  const unsigned = u16(state);
  return unsigned | (unsigned & 2 ** 15) * 0x1fffe;
};

export const i32: Decoder<number> = (state) => {
  return byte(state) + byte(state) * 2 ** 8 + byte(state) * 2 ** 16 + (byte(state) << 24);
};

export const i64: Decoder<bigint> = (state) => {
  return BigInt(u32(state)) + (BigInt(i32(state)) << 32n);
};

export const i128: Decoder<bigint> = (state) => {
  return u64(state) + (i64(state) << 64n);
};

export const i256: Decoder<bigint> = (state) => {
  return u128(state) + (i128(state) << 128n);
};

export const compact: Decoder<number | bigint> = (state) => {
  const b = byte(state);
  switch (b & 3) {
    case 0: {
      return b >> 2;
    }
    case 1: {
      return (b >> 2) + byte(state) * 2 ** 6;
    }
    case 2: {
      return (b >> 2) + byte(state) * 2 ** 6 + byte(state) * 2 ** 14 + byte(state) * 2 ** 22;
    }
    case 3: {
      return bigCompact(state, b >> 2);
    }
    default: {
      return asserts.unreachable();
    }
  }
};

export const bigCompact: SizedDecoder<bigint | number> = (state, len) => {
  const decodedU32 = u32(state);
  switch (len) {
    case 0: {
      return decodedU32;
    }
    case 1: {
      return decodedU32 + byte(state) * 2 ** 32;
    }
    case 2: {
      return decodedU32 + byte(state) * 2 ** 32 + byte(state) * 2 ** 40;
    }
  }
  let decodedU32AsBigint = BigInt(decodedU32);
  let base = 32n;
  while (len--) {
    decodedU32AsBigint += BigInt(byte(state)) << base;
    base += 8n;
  }
  return decodedU32AsBigint;
};

const assertNumIdentity = (inQuestion: number | bigint): number => {
  asserts.assert(typeof inQuestion === "number");
  return inQuestion;
};

export const str: Decoder<string> = (state) => {
  return new TextDecoder().decode(bytes(state, assertNumIdentity(compact(state))));
};

export const bool: Decoder<boolean> = (tate) => {
  return !!byte(tate);
};

export type OptionDecoder<T> = Decoder<T | undefined>;
export type AnyOptionDecoder = OptionDecoder<any>;
export const Option = <T>(someDecoder: Decoder<T>): OptionDecoder<T> => {
  return (state) => {
    switch (u8(state)) {
      case 0: {
        return undefined;
      }
      case 1: {
        return someDecoder(state);
      }
      default: {
        asserts.unreachable();
      }
    }
  };
};

export const decodeBooleanOption: Decoder<boolean | undefined> = (state) => {
  switch (u8(state)) {
    case 0: {
      return undefined;
    }
    case 1: {
      return true;
    }
    case 2: {
      return false;
    }
    default: {
      asserts.unreachable();
    }
  }
};

// TODO: rename this.
type TupleDecoded<Decoders extends AnyDecoder[]> = {
  [I in keyof Decoders]: TupleDecoded._0<Decoders[I]>;
};
namespace TupleDecoded {
  export type _0<I> = I extends AnyDecoder ? ReturnType<I> : I;
}
export const Tuple = <Decoders extends AnyDecoder[]>(
  ...decoders: Decoders
): Decoder<TupleDecoded<Decoders>> => {
  return (state) => {
    return decoders.map((decoder) => {
      return decoder(state);
    }) as any;
  };
};

export type ArrayDecoder<
  ElementDecoder extends AnyDecoder,
  _Length extends number,
> = Decoder<ReturnType<ElementDecoder>[]>;
// & { length: _Length };

export const FixedSizeArray = <
  ElementDecoder extends AnyDecoder,
  Length extends number,
>(
  elementDecoder: ElementDecoder,
  length: Length,
): ArrayDecoder<ElementDecoder, Length> => {
  return (state) => {
    const result: ReturnType<ElementDecoder>[] = [];
    for (let i = 0; i < length; i++) {
      result.push(elementDecoder(state));
    }
    return result;
  };
};

export const UnknownSizeArray = <ElementDecoder extends AnyDecoder>(
  elementDecoder: ElementDecoder,
): ArrayDecoder<ElementDecoder, number> => {
  return (state) => {
    return FixedSizeArray(elementDecoder, assertNumIdentity(compact(state)))(state);
  };
};

// TODO: replace with "instantiation expressions" when TS 4.7 is released.
// https://github.com/microsoft/TypeScript/pull/47607
export const Literal = <Constraint>() => {
  return <Value extends Constraint>(value: Value): Decoder<Value> => {
    return () => {
      return value;
    };
  };
};
export type PropertyKeyLiteral<Literal extends PropertyKey> = Decoder<Literal>;
export const PropertyKeyLiteral = Literal<PropertyKey>();

export const As = <T>(decoder: AnyDecoder): Decoder<T> => {
  return decoder as any;
};

export const Union = <Members extends AnyDecoder[]>(...members: Members): Decoder<ReturnType<Members[number]>> => {
  return (state) => {
    const variantDecoder = members[u8(state)];
    asserts.assert(variantDecoder);
    return variantDecoder(state);
  };
};

export type RecordFieldDecoded<
  FieldName extends PropertyKey,
  FieldDecoder extends AnyDecoder,
> = { [_ in FieldName]: ReturnType<FieldDecoder> };
export type RecordField<
  FieldName extends PropertyKey,
  FieldDecoder extends AnyDecoder,
> = Decoder<RecordFieldDecoded<FieldName, FieldDecoder>>;
export type AnyRecordField = RecordField<PropertyKey, AnyDecoder>;
export const RecordField = <
  FieldName extends PropertyKey,
  FieldDecoder extends AnyDecoder,
>(
  name: FieldName,
  decoder: FieldDecoder,
): RecordField<FieldName, FieldDecoder> => {
  return (state) => {
    return { [name]: decoder(state) } as any;
  };
};

export const SkipRecordField = <FieldDecoder extends AnyDecoder>(
  decoder: FieldDecoder,
): RecordField<never, Decoder<never>> => {
  return (state) => {
    decoder(state);
    return {};
  };
};

export type OptionalRecordFieldDecoded<
  FieldName extends PropertyKey,
  FieldDecoder extends AnyDecoder,
> = { [_ in FieldName]?: ReturnType<FieldDecoder> };
export const SkipRecordFieldIf = <
  FieldName extends PropertyKey,
  ValueDecoder extends AnyDecoder,
>(
  fieldName: FieldName,
  valueDecoder: ValueDecoder,
  condition: (result: ReturnType<ValueDecoder>) => boolean,
): Decoder<OptionalRecordFieldDecoded<FieldName, ValueDecoder>> => {
  return (state) => {
    const decoded = valueDecoder(state);
    if (condition(decoded)) {
      return {};
    }
    return { [fieldName]: decoded } as any;
  };
};

export type RecordDecoded<Fields extends AnyRecordField[]> = UnionToIntersection<ReturnType<Fields[number]>>;

// export type OptionalRecordField<
//   FieldName extends PropertyKey,
//   FieldDecoder extends AnyDecoder,
// > = Decoder<{ [_ in FieldName]?: ReturnType<FieldDecoder> }>;
// export const OptionalRecordField = <
//   FieldName extends PropertyKey,
//   ValueDecoded,
//   ValueDecoder extends Decoder<ValueDecoded>,
// >(
//   name: FieldName,
//   valueDecoder: ValueDecoder,
//   exclusionCondition: (decoded: ValueDecoded) => boolean,
// ): RecordField<FieldName, ValueDecoder> => {
//   return (state) => {
//     const decoded = valueDecoder(state);
//     return exclusionCondition(decoded)
//       ? { [name]: decoded } as any
//       : {};
//   };
// };

const _Record = <
  Fields extends AnyRecordField[],
  Decoded extends RecordDecoded<Fields>,
>(...fields: Fields): Decoder<Decoded> => {
  return (state) => {
    return fields.reduce((acc, decodeField) => {
      return {
        ...acc,
        ...decodeField(state),
      };
    }, {} as any);
  };
};
export { _Record as Record };
