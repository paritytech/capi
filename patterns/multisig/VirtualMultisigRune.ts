import { type Event as ProxyEvent } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { type RuntimeEvent } from "polkadot_dev/types/polkadot_runtime.ts"
import {
  Chain,
  ChainRune,
  Event,
  ExtrinsicRune,
  ExtrinsicSender,
  hex,
  MetaRune,
  MultiAddress,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
import { $ } from "../../mod.ts"
import { replaceDelegateCalls } from "../proxy/mod.ts"
import { Multisig, MultisigRune } from "./MultisigRune.ts"

export interface VirtualMultisig {
  signatoriesMap: [Uint8Array, Uint8Array][]
  threshold?: number
  stash: Uint8Array
}
export const $virtualMultisig: $.Codec<VirtualMultisig> = $.object(
  $.field("signatoriesMap", $.array($.tuple($.sizedUint8Array(32), $.sizedUint8Array(32)))),
  $.optionalField("threshold", $.u8),
  $.field("stash", $.sizedUint8Array(32)),
)

export class VirtualMultisigRune<out U, out C extends Chain = Chain>
  extends Rune<VirtualMultisig, U>
{
  inner
  proxies
  stash
  encoded
  hex

  constructor(_prime: VirtualMultisigRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
    super(_prime)
    const v = this.into(ValueRune)
    this.stash = v.access("stash")
    this.proxies = v.access("signatoriesMap")
      .map((arr) => arr.map((a, i) => [hex.encode(a[0]), i] as const))
      .map((a) => Object.fromEntries(a))
    this.encoded = v.map((m) => $virtualMultisig.encode(m))
    this.hex = this.encoded.map(hex.encode)

    const signatories = v.access("signatoriesMap").map((arr) => arr.map((a) => a[1]))
    const threshold = v.access("threshold")
    this.inner = Rune.rec({
      signatories: signatories,
      threshold: threshold,
    }).into(MultisigRune, chain)
  }

  proxyBySenderAddr<X>(...[senderAddr]: RunicArgs<X, [Uint8Array]>) {
    return Rune
      .tuple([
        this.inner.into(ValueRune).access("signatories"),
        this.proxies,
        Rune.resolve(senderAddr).map(hex.encode),
      ])
      .map(([signatories, proxyMap, senderAddr]) =>
        MultiAddress.Id(signatories[proxyMap[senderAddr]!]!)
      )
  }

  fundSenderProxy<X>(...[senderAddr, amount]: RunicArgs<X, [Uint8Array, bigint]>) {
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

    return Rune.rec({
      type: "Proxy",
      value: Rune.rec({
        type: "proxy",
        real: sender,
        forceProxyType: undefined,
        call: this.inner.ratify({
          call: call_,
          sender,
        }),
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  static fromHex<U, X>(chain: ChainRune<U, any>, ...[hexStr]: RunicArgs<X, [string]>) {
    return Rune
      .resolve(hexStr)
      .map((s) => $virtualMultisig.decode(hex.decode(s)))
      .into(VirtualMultisigRune, chain)
  }

  static deployment<U, X>(
    chain: ChainRune<U, any>,
    props: RunicArgs<X, VirtualMultisigDeploymentProps>,
  ) {
    const { threshold } = props
    const existentialDepositAmount = Rune
      .resolve(props.existentialDepositAmount)
      .unhandle(undefined)
      .rehandle(
        undefined,
        () => chain.metadata().pallet("Balances").const("ExistentialDeposit").decoded,
      )
    const members = Rune.resolve(props.signatories)
    const configurator = Rune.resolve(props.deployer)
    const membersCount = members.map((members) => members.length)
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
        })))
    ).into(MetaRune).flat()
    const proxies = chain
      .extrinsic(Rune.rec({
        type: "Utility",
        value: Rune.rec({
          type: "batchAll",
          calls: proxyCreationCalls,
        }),
      }))
      .signed({ sender: configurator })
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
          })
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
    }))
    const stashDepositCall = chain.extrinsic(Rune.rec({
      type: "Balances",
      value: Rune.rec({
        type: "transfer",
        dest: stashProxy.map(MultiAddress.Id),
        value: existentialDepositAmount,
      }),
    }))

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
      }))
      .signed({ sender: configurator })
      .sent()
      .dbgStatus("Existential deposits:")
      .finalized()

    const ownershipSwapCalls = Rune
      .tuple([configurator, members, memberProxies, stashProxy, multisig.address])
      .map(([configurator, members, memberProxies, stashProxy, multisigAddress]) =>
        Rune.array([
          ...replaceDelegateCalls(
            chain,
            MultiAddress.Id(stashProxy),
            configurator.address,
            multisigAddress,
          ),
          ...memberProxies.flatMap((proxy, i) =>
            replaceDelegateCalls(
              chain,
              MultiAddress.Id(proxy),
              configurator.address,
              MultiAddress.Id(members[i]!),
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
      }))
      .signed({ sender: configurator })
      .sent()
      .dbgStatus("Ownership swaps:")
      .finalized()

    const concatenatedSignatories = Rune.tuple([members, memberProxies])
      .map(([a, b]) => a.map((p, i) => [p, b[i]!] as [Uint8Array, Uint8Array]))

    return proxies
      .chain(() => existentialDeposits)
      .chain(() => ownershipSwaps)
      .chain(() =>
        Rune.rec({
          signatoriesMap: concatenatedSignatories,
          threshold,
          stash: stashProxy,
        })
      )
      .into(VirtualMultisigRune, chain)
  }
}

export interface VirtualMultisigDeploymentProps extends Multisig {
  deployer: ExtrinsicSender
  existentialDepositAmount?: bigint
}

export function filterPureCreatedEvents<X>(...[events]: RunicArgs<X, [Event[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .filter((event): event is RuntimeEvent.Proxy => event.type === "Proxy")
      .map((e) => e.value)
      .filter((event): event is ProxyEvent.PureCreated => event.type === "PureCreated")
  )
}
