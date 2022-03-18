// TODO: high priority

export class EncoderState {
  idx = 0;
  bytes;
  dv;

  constructor(private threshold: number) {
    this.bytes = new Uint8Array(threshold);
    this.dv = new DataView(this.bytes.buffer);
  }

  // TODO: ensure this works properly
  // Minimize reallocations.
  // reallocationCheck(toBePushed: number) {
  //   if (this.bytes.byteLength + toBePushed > this.threshold) {
  //     this.threshold *= 2; // TODO: tweak this
  //     const next = new Uint8Array(this.threshold);
  //     next.set(this.bytes);
  //     this.bytes = next;
  //   }
  // }

  digest(): Uint8Array {
    return this.bytes.slice(0, this.idx);
  }
}

// export type SizedDecoder<Decoded> = (src: Src, len: number) => Decoded;
export type Encoder<Decoded> = (decoded: Decoded) => (encoderState: EncoderState) => void;
export type AnyEncoder = Encoder<any>;
export type UnknownEncoder = Encoder<unknown>;

export const bool: Encoder<boolean> = (value) => {
  return (encoderState) => {
    encoderState.bytes[encoderState.idx++] = value ? 1 : 0;
  };
};

export const u8: Encoder<number> = (value) => {
  return (encoderState) => {
    encoderState.bytes[encoderState.idx++] = value;
  };
};

export const u16: Encoder<number> = (value) => {
  return (encoderState) => {
    encoderState.bytes.set([...new Uint16Array([value])], encoderState.idx);
    encoderState.idx += 2;
  };
};

export const u32: Encoder<number> = (value) => {
  return (encoderState) => {
    encoderState.bytes.set([...new Uint32Array([value])], encoderState.idx);
    encoderState.idx += 4;
  };
};

export const u64: Encoder<bigint> = (value) => {
  return (encoderState) => {};
};

export const u128: Encoder<bigint> = (value) => {
  return (encoderState) => {};
};

export const u256: Encoder<bigint> = (value) => {
  return (encoderState) => {};
};

export const i8: Encoder<number> = (value) => {
  return (encoderState) => {
    encoderState.dv.setInt8(encoderState.idx, value);
    encoderState.idx += 1;
  };
};

export const i16: Encoder<number> = (value) => {
  return (encoderState) => {
    encoderState.dv.setInt16(encoderState.idx, value, true);
    encoderState.idx += 2;
  };
};

export const i32: Encoder<number> = (value) => {
  return (encoderState) => {
    encoderState.dv.setInt32(encoderState.idx, value, true);
    encoderState.idx += 4;
  };
};

export const i64: Encoder<bigint> = (value) => {
  return (encoderState) => {
    encoderState.dv.setBigInt64(encoderState.idx, value, true);
    encoderState.idx += 8;
  };
};

export const i128: Encoder<bigint> = (value) => {
  return (encoderState) => {};
};

export const i256: Encoder<bigint> = (value) => {
  return (encoderState) => {};
};

export const str: Encoder<string> = (value) => {
  return (encoderState) => {};
};
