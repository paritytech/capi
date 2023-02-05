import { Chain, ClientRune, PublicKeyRune } from "../../fluent/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { ContractMsgRune } from "./ContractMsgRune.ts"
import { ContractRune } from "./ContractRune.ts"

export class ContractInstanceRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(
    _prime: ContractInstanceRune<U>["_prime"],
    readonly client: ClientRune<U, C>,
    readonly contract: ContractRune<U, C>,
  ) {
    super(_prime)
  }

  address() {
    return this.into(PublicKeyRune).address(this.client)
  }

  // msg<X>(
  //   ...args: RunicArgs<X, [
  //     sender: Uint8Array,
  //     method: string,
  //     ...args: unknown[],
  //   ]>
  // ): ContractMsgRune<U> {
  //   const [sender, method, ...msgArgs] = RunicArgs.resolve(args)
  //   const payload = Rune.rec({
  //     sender,
  //     contractAddress: this.address(),
  //     metadata: this.contract,
  //     message: this.contract.metadata.msg(method),
  //     args,
  //   })
  // }

  // $msg<X>(...[msg]: RunicArgs<X, >): Z.$<MessageCodecs> {
  //   return Z.ls(metadata, message).next(([metadata, message]) => {
  //     const deriveCodec = DeriveCodec(metadata.V3.types)
  //     return {
  //       $args: $.tuple(
  //         // message selector
  //         $.sizedUint8Array(U.hex.decode(message.selector).length),
  //         // message args
  //         ...message.args.map((arg) => deriveCodec(arg.type.type)),
  //       ),
  //       $result: message.returnType !== null
  //         ? deriveCodec(message.returnType.type)
  //         : $.constant(null),
  //     }
  //   })
  // }
}
