import { MultiAddress } from "polkadot/types/sp_runtime/multiaddress.js"
import { equals } from "../../deps/std/bytes.ts"
import {
  $,
  Chain,
  ChainRune,
  ExtrinsicRune,
  hex,
  MetaRune,
  PatternRune,
  Rune,
  RunicArgs,
  SignatureDataFactory,
  TmpEventsChain,
  ValueRune,
} from "../../mod.ts"
import { filterPureCreatedEvents, replaceDelegateCalls } from "../proxy/mod.ts"
import { MultisigChain, MultisigRune } from "./MultisigRune.ts"

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

export type VirtualMultisigChain<C extends Chain> = MultisigChain<C> & TmpEventsChain

export class VirtualMultisigRune<out C extends Chain, out U>
  extends PatternRune<VirtualMultisig, VirtualMultisigChain<C>, U>
{
  value = this.into(ValueRune)
  stash = this.value.access("stash")
  proxies = this.value
    .access("members")
    .map((arr) => Object.fromEntries(arr.map((a, i): [string, number] => [hex.encode(a[0]), i])))
  inner = Rune.rec({
    signatories: this.value.access("members").map((arr) => arr.map((a) => a[1])),
    threshold: this.value.access("threshold"),
  }).into(MultisigRune, this.chain)
  encoded = this.value.map((m) => $virtualMultisig.encode(m))
  hex = this.encoded.map(hex.encode)

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
      .into(ExtrinsicRune, this.chain)
  }

  ratify<X>(...[senderAddr, call]: RunicArgs<X, [Uint8Array, unknown]>) {
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
      }),
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
      .into(ExtrinsicRune, this.chain)
  }

  static hydrate<C extends Chain, U, X>(
    chain: ChainRune<VirtualMultisigChain<C>, U>,
    ...[state]: RunicArgs<X, [state: string]>
  ) {
    return Rune
      .resolve(state)
      .map((s) => $virtualMultisig.decode(hex.decode(s)))
      .into(VirtualMultisigRune, chain)
  }

  static deployment<C extends Chain, CU, SU, X>(
    chain: ChainRune<VirtualMultisigChain<C>, CU>,
    props: RunicArgs<X, VirtualMultisigDeploymentProps>,
    signature: SignatureDataFactory<VirtualMultisigChain<C>, any, SU>,
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
      .signed(signature)
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
          chain.extrinsic(Rune.rec({
            type: "Balances",
            value: Rune.rec({
              type: "transfer",
              dest: MultiAddress.Id(memberProxy),
              value,
            }),
          }))
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
      .signed(signature)
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
            deployer,
            multisigAddress,
          ),
          // TODO: ensure that this supports other address types / revisit source of deployer accountId
          ...memberProxies
            .map((proxy, i) => [proxy, i] as const)
            .filter(([_, i]) => !equals(memberAccountIds[i]!, deployer.value!))
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
      .extrinsic(Rune.rec({
        type: "Utility",
        value: Rune.rec({
          type: "batchAll",
          calls: ownershipSwapCalls,
        }),
      }))
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
  deployer: MultiAddress
  existentialDepositAmount?: bigint
}
