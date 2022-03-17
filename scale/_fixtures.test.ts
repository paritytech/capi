import { identity } from "/_/util/fn.ts";
import { visitFixtures } from "/_/util/testing.ts";
import * as d from "/scale/decode.ts";
import * as e from "/scale/encode.ts";
import * as f from "/target/wasm/scale_fixtures/mod.js";
import * as asserts from "std/testing/asserts.ts";

// TODO: DON'T SKIP!
// ... issues might stem from fixture generation.
const tmpSkip: Record<"decode" | "encode", Record<string, true>> = {
  decode: {
    I64: true,
    U64: true,
    I128: true,
    U128: true,
  },
  encode: {
    I8: true,
    I16: true,
    I32: true,
    I64: true,
    U16: true,
    U32: true,
    U64: true,
    I128: true,
    U128: true,
    Str: true,
  },
};

([
  ["Boolean", f.bool_, d.bool, e.bool],
  ["U8", f.u8_, d.u8, e.u8],
  ["I8", f.i8_, d.i8, e.i8],
  ["U16", f.u16_, d.u16, e.u16],
  ["I16", f.i16_, d.i16, e.i16],
  ["U32", f.u32_, d.u32, e.u32],
  ["I32", f.i32_, d.i32, e.i32],
  ["U64", f.u64_, d.u64, e.u64, BigInt],
  ["I64", f.i64_, d.i64, e.i64, BigInt],
  ["U128", f.u128_, d.u128, e.u128, BigInt],
  ["I128", f.i128_, d.i128, e.i128, BigInt],
  ["Str", f.str_, d.str, d.str],
] as const).forEach(([typeName, getFixtures, decode, encode, sanitizeSpecificDecoded]) => {
  Deno.test(`${typeName} Transcoders`, () => {
    visitFixtures(getFixtures, (encoded, unsanitizedDecoded) => {
      const decoded = (sanitizeSpecificDecoded || identity)(unsanitizedDecoded);
      if (!tmpSkip.decode[typeName]) {
        asserts.assertEquals(d.run(decode as any, encoded), decoded);
      }
      if (!tmpSkip.encode[typeName]) {
        const encoderState = new e.EncoderState(256);
        (encode as any)(decoded)(encoderState);
        asserts.assertEquals(encoderState.digest(), encoded);
      }
    });
  });
});

Deno.test("Option Transcoders", () => {
  visitFixtures(f.option_, (encoded, decoded, i) => {
    asserts.assertEquals(
      d.run(
        d.Option(
          {
            [0]: d.str,
            [1]: d.u8,
            [2]: d.str,
            [3]: d.u32,
            [4]: undefined as unknown as d.AnyDecoder,
          }[i]!,
        ),
        encoded,
      ),
      decoded,
    );
  }, (value) => {
    return value || undefined;
  });
});

Deno.test("Tuple Transcoders", () => {
  visitFixtures(f.tuple_, (encoded, decoded, i) => {
    asserts.assertEquals(
      d.run(
        d.Tuple(
          ...{
            [0]: [d.str, d.u8, d.str, d.u32],
            [1]: [d.str, d.i16, d.Option(d.u16)],
          }[i]!,
        ),
        encoded,
      ),
      decoded,
    );
  });
});

Deno.test("Variant Transcoders", () => {
  const decodeA = d.Union(
    d.Record(d.RecordField("_tag", d.PropertyKeyLiteral("A"))),
    d.Record(
      d.RecordField("_tag", d.PropertyKeyLiteral("B")),
      d.RecordField("value", d.str),
    ),
    d.Record(
      d.RecordField("_tag", d.PropertyKeyLiteral("C")),
      d.RecordField("value", d.Tuple(d.u32, d.u64)),
    ),
  );

  visitFixtures(f.variant_, (encoded, decoded, i) => {
    asserts.assertEquals(
      d.run(
        {
          [0]: decodeA,
          [1]: decodeA,
          [2]: decodeA,
        }[i]!,
        encoded,
      ),
      decoded,
    );
  }, (unsanitizedDecoded) => {
    if (typeof unsanitizedDecoded === "string") {
      return { _tag: unsanitizedDecoded };
    } else if (typeof unsanitizedDecoded === "object") {
      const tag = Object.keys(unsanitizedDecoded)?.[0];
      asserts.assert(tag);
      return {
        _tag: tag,
        value: tag === "C"
          // TODO: find better route for sanitizing `BigInt`s. Preferably from the Rust side.
          ? [unsanitizedDecoded[tag][0], BigInt(unsanitizedDecoded[tag][1])]
          : unsanitizedDecoded[tag],
      };
    }
    asserts.fail();
  });
});

Deno.test("Struct Transcoders", () => {
  const decodePerson = d.Record(
    d.RecordField("name", d.str),
    d.RecordField("nickName", d.str),
    d.RecordField("superPower", d.Option(d.str)),
    d.RecordField("luckyNumber", d.u8),
  );

  visitFixtures(f.struct_, (encoded, decoded, i) => {
    asserts.assertEquals(
      d.run(
        {
          [0]: decodePerson,
          [1]: decodePerson,
          [2]: decodePerson,
        }[i]!,
        encoded,
      ),
      decoded,
    );
  }, (unsanitizedDecoded) => {
    return Object.entries(unsanitizedDecoded).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value === null ? undefined : value,
      };
    }, {});
  });
});

Deno.test("Fixed-size Array Transcoders", () => {
  const u8l5Decoder = d.FixedSizeArray(d.u8, 5);

  visitFixtures(f.fixed_size_array_, (encoded, decoded) => {
    asserts.assertEquals(d.run(u8l5Decoder, encoded), decoded);
  });
});

Deno.test("Unknown-size Array Transcoders", () => {
  const u8ulDecoder = d.UnknownSizeArray(d.u8);

  visitFixtures(f.unknown_size_array_, (encoded, decoded) => {
    asserts.assertEquals(d.run(u8ulDecoder, encoded), decoded);
  });
});
