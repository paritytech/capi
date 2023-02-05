import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { DeriveCodec } from "../../scale_info/mod.ts"
import { Metadata } from "./ContractMetadata.ts"

export class ContractMetadataRune<out U> extends Rune<Metadata, U> {
  deriveCodec

  constructor(_prime: ContractMetadataRune<U>["_prime"]) {
    super(_prime)
    this.deriveCodec = this
      .into(ValueRune)
      .access("V3", "types")
      .map(DeriveCodec)
  }

  ctor<X>(...[name]: RunicArgs<X, [name?: string]>) {
    return Rune.tuple([
      this
        .into(ValueRune)
        .access("V3", "spec", "constructors"),
      Rune
        .resolve(name)
        .unhandle(undefined)
        .handle(undefined, () => Rune.resolve("default")),
    ])
      .map(([ctors, label]) => {
        const ctor = ctors.find((ctor) => ctor.label === label)
        if (!ctor) return new InvalidMetadataError()
        return ctor
      })
      .unhandle(InvalidMetadataError)
  }

  msg<X>(...[name]: RunicArgs<X, [name?: string]>) {
    return this
      .into(ValueRune)
      .access("V3", "spec", "messages")
      .map((msgs) => {
        const msg = msgs.find((msgs) => msgs.label === name)
        if (!msg) return new InvalidMsgError()
        return msg
      })
      .unhandle(InvalidMsgError)
  }
}

export class InvalidMetadataError extends Error {
  override readonly name = "InvalidMetadataError"
}

export class InvalidMsgError extends Error {
  override readonly name = "InvalidMsgError"
}
