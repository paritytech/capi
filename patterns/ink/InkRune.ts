import { Chain, ClientRune, PublicKeyRune } from "../../fluent/mod.ts"
import { Rune, RunicArgs } from "../../rune/mod.ts"
import { InkMetadataRune } from "./InkMetadataRune.ts"
import { InkMsgRune } from "./InkMsgRune.ts"

export class InkRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(
    _prime: InkRune<U>["_prime"],
    readonly client: ClientRune<U, C>,
    readonly contract: InkMetadataRune<U, C>,
  ) {
    super(_prime)
  }

  address() {
    return this.into(PublicKeyRune).address(this.client)
  }

  declare msg: <X>(
    ...args: RunicArgs<X, [
      sender: Uint8Array,
      method: string,
      ...args: unknown[],
    ]>
  ) => InkMsgRune<U>
}

// const [sender, method, ...msgArgs] = RunicArgs.resolve(args)
// const payload = Rune.rec({
//   sender,
//   contractAddress: this.address(),
//   metadata: this.contract,
//   message: this.contract.metadata.msg(method),
//   args,
// })
