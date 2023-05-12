import { MultiAddress } from "@capi/polkadot"
import * as bytes from "../../deps/std/bytes.ts"
import {
  $,
  Chain,
  ChainRune,
  hex,
  MetaRune,
  PatternRune,
  Rune,
  RunicArgs,
  SignatureDataFactory,
  ValueRune,
} from "../../mod.ts"
import { filterPureCreatedEvents, replaceDelegateCalls } from "../proxy/mod.ts"
import { MultisigRune } from "./MultisigRune.ts"

export interface VirtualMultisig {
  members: [Uint8Array, Uint8Array][]
  threshold?: number
  stash: Uint8Array
}
export const $virtualMultisig: $.Codec<VirtualMultisig> = $.object(
  $.field("members", $.array($.tuple($.sizedUint8Array(32), $.sizedUint8Array(32)))),
  $.optionalField("threshold", $.u8),
  $.field("stash", $.sizedUint8Array(32)),
)

export class VirtualMultisigRune<out C extends Chain, out U>
  extends PatternRune<VirtualMultisig, C, U>
{
  value = this.into(ValueRune)
  stash = this.value.access("stash")
  proxies = this.value
    .access("members")
    .map((arr) => Object.fromEntries(arr.map((a, i): [string, number] => [hex.encode(a[0]), i])))
  inner = Rune.object({
    signatories: this.value.access("members").map((arr) => arr.map((a) => a[1])),
    threshold: this.value.access("threshold"),
  }).into(MultisigRune, this.chain)
  encoded = this.value.map((m) => $virtualMultisig.encode(m))
  hex = this.encoded.map(hex.encode)

  senderProxyId<X>(...[senderAccountId]: RunicArgs<X, [senderAccountId: Uint8Array]>) {
    const senderAccountIdHex = Rune.resolve(senderAccountId).map(hex.encode)
    const senderProxyI = this.proxies.access(senderAccountIdHex)
    const senderProxyAccountId = this.inner
      .into(ValueRune)
      .access("signatories")
      .access(senderProxyI)
    return MultiAddress.Id(senderProxyAccountId)
  }

  fundMemberProxy<X>(
    ...[senderAccountId, amount]: RunicArgs<X, [senderAccountId: Uint8Array, amount: bigint]>
  ) {
    return this.chain.extrinsic(
      Rune
        .object({
          type: "Balances",
          value: Rune.object({
            type: "transfer",
            dest: this.senderProxyId(senderAccountId),
            value: amount,
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  ratify<X>(
    ...[senderAccountId, call, nonExecuting]: RunicArgs<
      X,
      [senderAccountId: Uint8Array, call: unknown, nonExecuting?: boolean]
    >
  ) {
    const sender = this.senderProxyId(senderAccountId)
    const call_ = this.chain.extrinsic(
      Rune
        .object({
          type: "Proxy" as const,
          value: Rune.object({
            type: "proxy" as const,
            real: MultiAddress.Id(this.stash),
            forceProxyType: undefined,
            call,
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
    return this.chain.extrinsic(
      Rune
        .object({
          type: "Proxy",
          value: Rune.object({
            type: "proxy",
            real: sender,
            forceProxyType: undefined,
            call: this.inner.ratify(sender, call_, nonExecuting),
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  static fromHex<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[state]: RunicArgs<X, [state: string]>
  ) {
    return Rune
      .resolve(state)
      .map((s) => $virtualMultisig.decode(hex.decode(s)))
      .into(VirtualMultisigRune, chain)
  }

  static deployment<C extends Chain, CU, SU, X>(
    chain: ChainRune<C, CU>,
    props: RunicArgs<X, VirtualMultisigDeploymentProps>,
    signature: SignatureDataFactory<C, any, SU>,
  ) {
    const { threshold } = props
    const existentialDepositAmount = Rune
      .resolve(props.existentialDepositAmount)
      .unhandle(undefined)
      .rehandle(
        undefined,
        () => chain.pallet("Balances").constant("ExistentialDeposit").decoded,
      )
    const suppliedStash = Rune.resolve(props.stash)
    const memberAccountIds = Rune.resolve(props.founders)
    const deployer = Rune.resolve(props.deployer)
    const membersCount = memberAccountIds.map((members) => members.length)
    const proxyCreationCalls = Rune.tuple([membersCount, suppliedStash]).map(([n, stash]) =>
      Rune.array(Array.from({ length: n + (stash ? 0 : 1) }, (_, index) =>
        chain.extrinsic(
          Rune
            .object({
              type: "Proxy",
              value: {
                type: "createPure",
                proxyType: "Any",
                delay: 0,
                index,
              },
            })
            .unsafeAs<Chain.Call<C>>(),
        )))
    ).into(MetaRune).flat()

    const proxies = chain
      .extrinsic(
        Rune
          .object({
            type: "Utility",
            value: Rune.object({
              type: "batchAll",
              calls: proxyCreationCalls,
            }),
          })
          .unsafeAs<Chain.Call<C>>(),
      )
      .signed(signature)
      .sent()
      .dbgStatus("Proxy creations:")
      .finalizedEvents()
      .unhandleFailed()
      .pipe(filterPureCreatedEvents)
      .map((events) =>
        events
          .sort((a, b) => a.disambiguationIndex > b.disambiguationIndex ? 1 : -1)
          .map(({ pure }) => pure)
      )

    const proxiesGrouped = Rune
      .tuple([proxies, membersCount, suppliedStash])
      .map(([proxies, membersCount, stash]) =>
        [
          proxies.slice(0, membersCount),
          stash ?? proxies[membersCount],
        ] as [Uint8Array[], Uint8Array]
      )
    const memberProxies = proxiesGrouped.access(0)
    const stashProxy = proxiesGrouped.access(1)
    const memberProxyExistentialDepositCalls = Rune
      .tuple([existentialDepositAmount, memberProxies])
      .map(([value, memberProxies]) =>
        Rune.array(memberProxies.map((memberProxy) =>
          chain.extrinsic(
            Rune
              .object({
                type: "Balances",
                value: Rune.object({
                  type: "transfer",
                  dest: MultiAddress.Id(memberProxy),
                  value,
                }),
              })
              .unsafeAs<Chain.Call<C>>(),
          )
        ))
      )
      .into(MetaRune)
      .flat()
    const multisig = Rune
      .object({
        signatories: memberProxies,
        threshold,
      })
      .into(MultisigRune, chain)
    const multisigExistentialDepositCall = chain.extrinsic(
      Rune
        .object({
          type: "Balances",
          value: Rune.object({
            type: "transfer",
            dest: MultiAddress.Id(multisig.accountId),
            value: existentialDepositAmount,
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
    const stashDepositCall = chain.extrinsic(
      Rune
        .object({
          type: "Balances",
          value: Rune.object({
            type: "transfer",
            dest: MultiAddress.Id(stashProxy),
            value: existentialDepositAmount,
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )

    const existentialDepositCalls = Rune
      .tuple([memberProxyExistentialDepositCalls, multisigExistentialDepositCall, stashDepositCall])
      .map(([a, b, c]) => [...a, b, c])
    const existentialDeposits = chain
      .extrinsic(
        Rune
          .object({
            type: "Utility",
            value: Rune.object({
              type: "batchAll",
              calls: existentialDepositCalls,
            }),
          })
          .unsafeAs<Chain.Call<C>>(),
      )
      .signed(signature)
      .sent()
      .dbgStatus("Existential deposits:")
      .finalized()

    const ownershipSwapCalls = Rune
      .tuple([deployer, memberAccountIds, memberProxies, stashProxy, multisig.address])
      .map(([deployer, memberAccountIds, memberProxies, stashProxy, multisigAddress]) =>
        Rune.array([
          ...replaceDelegateCalls(chain, MultiAddress.Id(stashProxy), deployer, multisigAddress),
          // TODO: ensure that this supports other address types / revisit source of deployer accountId
          ...memberProxies
            .map((proxy, i) => [proxy, i] as const)
            .filter(([_, i]) => !bytes.equals(memberAccountIds[i]!, deployer.value!))
            .flatMap(([proxy, i]) =>
              replaceDelegateCalls(
                chain,
                MultiAddress.Id(proxy),
                deployer,
                MultiAddress.Id(memberAccountIds[i]!),
              )
            ),
        ])
      )
      .into(MetaRune)
      .flat()
    const ownershipSwaps = chain
      .extrinsic(
        Rune
          .object({
            type: "Utility",
            value: Rune.object({
              type: "batchAll",
              calls: ownershipSwapCalls,
            }),
          })
          .unsafeAs<Chain.Call<C>>(),
      )
      .signed(signature)
      .sent()
      .dbgStatus("Ownership swaps:")
      .finalized()

    const members = Rune.tuple([memberAccountIds, memberProxies])
      .map(([a, b]) => a.map((p, i) => [p, b[i]!] as [Uint8Array, Uint8Array]))

    return proxies
      .chain(() => existentialDeposits)
      .chain(() => ownershipSwaps)
      .chain(() =>
        Rune.object({
          members,
          threshold,
          stash: stashProxy,
        })
      )
      .into(VirtualMultisigRune, chain)
  }
}

export interface VirtualMultisigDeploymentProps {
  founders: Uint8Array[]
  threshold?: number
  stash?: Uint8Array
  deployer: MultiAddress
  existentialDepositAmount?: bigint
}
