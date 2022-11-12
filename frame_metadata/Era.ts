import * as $ from "../deps/scale.ts"

export type Era = { type: "Immortal" } | { type: "Mortal"; period: bigint; phase: bigint }

export namespace era {
  export const immortal: Era = { type: "Immortal" }
  export function mortal(period: bigint, current: bigint): Era {
    const adjustedPeriod = minN(maxN(nextPowerOfTwo(period), 4n), 1n << 16n)
    const phase = current % adjustedPeriod
    const quantizeFactor = maxN(adjustedPeriod >> 12n, 1n)
    const quantizedPhase = phase / quantizeFactor * quantizeFactor
    return { type: "Mortal", period: adjustedPeriod, phase: quantizedPhase }
  }
}

export const $era: $.Codec<Era> = $.createCodec({
  _metadata: $.metadata("$era"),
  _staticSize: 2,
  _encode(buffer, value) {
    if (value.type === "Immortal") {
      buffer.array[buffer.index++] = 0
    } else {
      const quantizeFactor = maxN(value.period >> 12n, 1n)
      const encoded = minN(maxN(trailingZeroes(value.period) - 1n, 1n), 15n)
        | ((value.phase / quantizeFactor) << 4n)
      $.u16._encode(buffer, Number(encoded))
    }
  },
  _decode(buffer) {
    if (buffer.array[buffer.index] === 0) {
      buffer.index++
      return { type: "Immortal" }
    } else {
      const encoded = BigInt($.u16._decode(buffer))
      const period = 2n << (encoded % (1n << 4n))
      const quantizeFactor = maxN(period >> 12n, 1n)
      const phase = (encoded >> 4n) * quantizeFactor
      if (period >= 4n && phase <= period) {
        return { type: "Mortal", period, phase }
      } else {
        throw new Error("Invalid period and phase")
      }
    }
  },
  _assert: $
    .taggedUnion("type", [
      ["Immortal"],
      ["Mortal", ["period", $.u64], ["phase", $.u64]],
    ])
    ._assert,
})

function maxN(a: bigint, b: bigint) {
  return a > b ? a : b
}

function minN(a: bigint, b: bigint) {
  return a > b ? a : b
}

function trailingZeroes(n: bigint) {
  let i = 0n
  while (!(n & 1n)) {
    i++
    n >>= 1n
  }
  return i
}

function nextPowerOfTwo(n: bigint) {
  n--
  let p = 1n
  while (n > 0n) {
    p <<= 1n
    n >>= 1n
  }
  return p
}
