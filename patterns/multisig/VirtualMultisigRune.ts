import { MultiAddress } from "polkadot/types/sp_runtime/multiaddress.js"
import { equals } from "../../deps/std/bytes.ts"
import {
  $,
  Chain,
  ChainRune,
  EventsChain,
  ExtrinsicRune,
  ExtrinsicSender,
  hex,
  MetaRune,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
import { filterPureCreatedEvents, replaceDelegateCalls } from "../proxy/mod.ts"
import { PolkadotSignatureChain, signature } from "../signature/polkadot.ts"
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

export class VirtualMultisigRune<out C extends PolkadotSignatureChain, out U>
  extends Rune<VirtualMultisig, U>
{
  inner
  proxies
  stash
  encoded
  hex

  constructor(_prime: VirtualMultisigRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
    const v = this.into(ValueRune)
    this.stash = v.access("stash")
    this.proxies = v
      .access("members")
      .map((arr) => Object.fromEntries(arr.map((a, i): [string, number] => [hex.encode(a[0]), i])))
    this.inner = Rune.rec({
      signatories: v.access("members").map((arr) => arr.map((a) => a[1])),
      threshold: v.access("threshold"),
    }).into(MultisigRune, chain)
    this.encoded = v.map((m) => $virtualMultisig.encode(m))
    this.hex = this.encoded.map(hex.encode)
  }

  proxyBySenderAddr<X>(...[senderAddr]: RunicArgs<X, [Uint8Array]>) {
    const signatories = this.inner.into(ValueRune).access("signatories")
    return Rune
      .tuple([signatories, this.proxies, senderAddr])
      .map(([signatories, proxies, senderAddr]) =>
        MultiAddress.Id(signatories[proxies[hex.encode(senderAddr)]!]!)
      )
  }

  fundMemberProxy<X>(...[senderAddr, amount]: RunicArgs<X, [Uint8Array, bigint]>) {
    return Rune
      .rec({
        type: "Balances",
        value: Rune.rec({
          type: "transfer",
          dest: this.proxyBySenderAddr(senderAddr),
          value: amount,
        }),
      })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  ratify<X>(...[senderAddr, call]: RunicArgs<X, [Uint8Array, Chain.Call<C>]>) {
    const sender = this.proxyBySenderAddr(senderAddr)
    const call_ = this.chain.extrinsic(
      Rune.rec({
        type: "Proxy" as const,
        value: Rune.rec({
          type: "proxy" as const,
          real: this.stash.map(MultiAddress.Id),
          forceProxyType: undefined,
          call,
        }),
      }).unsafeAs<Chain.Call<C>>(),
    )

    return Rune
      .rec({
        type: "Proxy",
        value: Rune.rec({
          type: "proxy",
          real: sender,
          forceProxyType: undefined,
          call: this.inner.ratify({
            call: call_,
            sender: sender as any,
          }),
        }),
      })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  static hydrate<C extends PolkadotSignatureChain, U, X>(
    chain: ChainRune<C, U>,
    ...[state]: RunicArgs<X, [state: string]>
  ) {
    return Rune
      .resolve(state)
      .map((s) => $virtualMultisig.decode(hex.decode(s)))
      .into(VirtualMultisigRune, chain)
  }

  static deployment<C extends PolkadotSignatureChain, U, X>(
    chain: ChainRune<C, U>,
    props: RunicArgs<X, VirtualMultisigDeploymentProps>,
  ) {
    const { threshold } = props
    const existentialDepositAmount = Rune
      .resolve(props.existentialDepositAmount)
      .unhandle(undefined)
      .rehandle(
        undefined,
        () => chain.pallet("Balances").constant("ExistentialDeposit").decoded,
      )
    const memberAccountIds = Rune.resolve(props.founders)
    const deployer = Rune.resolve(props.deployer)
    const membersCount = memberAccountIds.map((members) => members.length)
    const proxyCreationCalls = membersCount.map((n) =>
      Rune.array(Array.from({ length: n + 1 }, (_, index) =>
        chain.extrinsic({
          type: "Proxy",
          value: {
            type: "createPure",
            proxyType: "Any",
            delay: 0,
            index,
          },
        } as any)))
    ).into(MetaRune).flat()
    const proxies = (chain as any as ChainRune<EventsChain<C>, U>)
      .extrinsic(Rune.rec({
        type: "Utility",
        value: Rune.rec({
          type: "batchAll",
          calls: proxyCreationCalls,
        }),
      } as any))
      .signed(signature({ sender: deployer }) as any)
      .sent()
      .dbgStatus("Proxy creation:")
      .finalizedEvents()
      .pipe(filterPureCreatedEvents)
      .map((events) =>
        events
          .sort((a, b) => a.disambiguationIndex > b.disambiguationIndex ? 1 : -1)
          .map(({ pure }) => pure)
      )

    const proxiesGrouped = Rune
      .tuple([proxies, membersCount])
      .map(([proxies, membersCount]) =>
        [proxies.slice(0, membersCount), proxies[membersCount]] as [Uint8Array[], Uint8Array]
      )
    const memberProxies = proxiesGrouped.access(0)
    const stashProxy = proxiesGrouped.access(1)
    const memberProxyExistentialDepositCalls = Rune
      .tuple([existentialDepositAmount, memberProxies])
      .map(([value, memberProxies]) =>
        Rune.array(memberProxies.map((memberProxy) =>
          chain.extrinsic({
            type: "Balances",
            value: {
              type: "transfer",
              dest: MultiAddress.Id(memberProxy),
              value,
            },
          } as any)
        ))
      )
      .into(MetaRune)
      .flat()
    const multisig = Rune
      .rec({
        signatories: memberProxies,
        threshold,
      })
      .into(MultisigRune, chain)
    const multisigExistentialDepositCall = chain.extrinsic(Rune.rec({
      type: "Balances",
      value: Rune.rec({
        type: "transfer",
        dest: multisig.accountId.map(MultiAddress.Id),
        value: existentialDepositAmount,
      }),
    }) as any)
    const stashDepositCall = chain.extrinsic(Rune.rec({
      type: "Balances",
      value: Rune.rec({
        type: "transfer",
        dest: stashProxy.map(MultiAddress.Id),
        value: existentialDepositAmount,
      }),
    }) as any)

    const existentialDepositCalls = Rune
      .tuple([memberProxyExistentialDepositCalls, multisigExistentialDepositCall, stashDepositCall])
      .map(([a, b, c]) => [...a, b, c])
    const existentialDeposits = chain
      .extrinsic(Rune.rec({
        type: "Utility",
        value: Rune.rec({
          type: "batchAll",
          calls: existentialDepositCalls,
        }),
      }) as any)
      .signed(signature({ sender: deployer }) as any)
      .sent()
      .dbgStatus("Existential deposits:")
      .finalized()

    const ownershipSwapCalls = Rune
      .tuple([deployer, memberAccountIds, memberProxies, stashProxy, multisig.address])
      .map(([deployer, memberAccountIds, memberProxies, stashProxy, multisigAddress]) =>
        Rune.array([
          ...replaceDelegateCalls(
            chain,
            MultiAddress.Id(stashProxy),
            deployer.address,
            multisigAddress,
          ),
          // TODO: ensure that this supports other address types / revisit source of deployer accountId
          ...memberProxies
            .map((proxy, i) => [proxy, i] as const)
            .filter(([_, i]) => !equals(memberAccountIds[i]!, deployer.address.value!))
            .flatMap(([proxy, i]) =>
              replaceDelegateCalls(
                chain,
                MultiAddress.Id(proxy),
                deployer.address,
                MultiAddress.Id(memberAccountIds[i]!),
              )
            ),
        ])
      )
      .into(MetaRune)
      .flat()
    const ownershipSwaps = chain
      .extrinsic(Rune.rec({
        type: "Utility",
        value: Rune.rec({
          type: "batchAll",
          calls: ownershipSwapCalls,
        }),
      }) as any)
      .signed(signature({ sender: deployer }) as any)
      .sent()
      .dbgStatus("Ownership swaps:")
      .finalized()

    const members = Rune.tuple([memberAccountIds, memberProxies])
      .map(([a, b]) => a.map((p, i) => [p, b[i]!] as [Uint8Array, Uint8Array]))

    return proxies
      .chain(() => existentialDeposits)
      .chain(() => ownershipSwaps)
      .chain(() =>
        Rune.rec({
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
  deployer: ExtrinsicSender<PolkadotSignatureChain>
  existentialDepositAmount?: bigint
}
