import { type Event as ProxyEvent } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { type RuntimeEvent } from "polkadot_dev/types/polkadot_runtime.ts"
import {
  Chain,
  ChainRune,
  Event,
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

export interface VirtualMultisig extends Multisig {
  stash: Uint8Array
}
export const $virtualMultisig = $.object(
  $.field("signatories", $.array($.sizedUint8Array(32))),
  $.field("threshold", $.option($.u8)),
  $.field("stash", $.sizedUint8Array(32)),
)

export class VirtualMultisigRune<out U, out C extends Chain = Chain>
  extends Rune<VirtualMultisig, U>
{
  inner
  signatories
  threshold
  stash
  encoded
  hex

  constructor(_prime: VirtualMultisigRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
    super(_prime)
    this.inner = this.into(MultisigRune, chain)
    const v = this.into(ValueRune)
    this.signatories = v.access("signatories")
    this.threshold = v.access("threshold")
    this.stash = v.access("stash")
    this.encoded = v.map((m) => $virtualMultisig.encode(m))
    this.hex = this.encoded.map(hex.encode)
  }

  ratify<X>(...[senderIndex, call]: RunicArgs<X, [number, Chain.Call<C>]>) {
    const call_ = this.chain.extrinsic(Rune.rec({
      type: "Proxy" as const,
      value: Rune.rec({
        type: "proxy" as const,
        real: this.stash.map(MultiAddress.Id),
        forceProxyType: undefined,
        call,
      }),
    }) as Chain.Call<C>)
    const sender = Rune
      .tuple([this.signatories, senderIndex])
      .map(([signatories, senderIndex]) => MultiAddress.Id(signatories[senderIndex]!))
    return this.chain.extrinsic(Rune.rec({
      type: "Proxy",
      value: Rune.rec({
        type: "proxy",
        real: sender,
        forceProxyType: undefined,
        call: this.inner.ratify({
          call: call_,
          sender,
        } as Chain.Call<C>),
      }),
    }) as Chain.Call<C>)
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
    const deposits = Rune
      .resolve(props.deposits)
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
      .txEvents()
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
      .tuple([deposits, memberProxies])
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
        value: deposits,
      }),
    }))
    const existentialDepositCalls = Rune
      .tuple([memberProxyExistentialDepositCalls, multisigExistentialDepositCall])
      .map(([m, s]) => [...m, s])
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

    return proxies
      .chain(() => existentialDeposits)
      .chain(() => ownershipSwaps)
      .chain(() =>
        Rune.rec({
          signatories: memberProxies,
          threshold,
          stash: stashProxy,
        })
      )
      .into(VirtualMultisigRune, chain)
  }
}

export interface VirtualMultisigDeploymentProps extends Multisig {
  deployer: ExtrinsicSender
  deposits?: bigint
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
