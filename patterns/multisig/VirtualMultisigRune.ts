import { Balances, Polkadot, Proxy, Utility } from "polkadot/mod.js"
import { MultiAddress } from "polkadot/types/sp_runtime/multiaddress.js"
import { equals } from "../../deps/std/bytes.ts"
import {
  $,
  Chain,
  ChainRune,
  EventsChain,
  ExtrinsicSender,
  hex,
  MetaRune,
  PatternRune,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
import { filterPureCreatedEvents, replaceDelegateCalls } from "../proxy/mod.ts"
import { ProxyChain } from "../proxy/replaceDelegateCalls.ts"
import { PolkadotSignatureChain, signature } from "../signature/polkadot.ts"
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

// TODO: incorporate `C` into pick util types
export type VirtualMultisigChain<C extends Chain> =
  & Chain.PickStorage<Polkadot, "Multisig", "Multisigs">
  & Chain.PickStorage<Polkadot, "Proxy", "Proxies">
  & Chain.PickCall<
    Polkadot,
    "Multisig" | "Proxy",
    "asMulti" | "approveAsMulti" | "cancelAsMulti" | "proxy" | "addProxy" | "removeProxy"
  >

export class VirtualMultisigRune<out C extends Chain, out U>
  extends PatternRune<VirtualMultisig, VirtualMultisigChain<C>, U>
{
  private value = this.into(ValueRune)
  stash = this.value.access("stash")
  proxies = this.value.access("members").map((arr) =>
    Object.fromEntries(arr.map((a, i): [string, number] => [hex.encode(a[0]), i]))
  )
  encoded = this.value.map((m) => $virtualMultisig.encode(m))
  hex = this.encoded.map(hex.encode)
  inner = Rune
    .rec({
      signatories: this.value.access("members").map((arr) => arr.map((a) => a[1])),
      threshold: this.value.access("threshold"),
    })
    // TODO: get rid
    .into(MultisigRune, this.chain as ChainRune<MultisigChain<C>, U>)

  proxyBySenderAddr<X>(...[senderAddr]: RunicArgs<X, [Uint8Array]>) {
    const sender = Rune.fn(hex.encode).call(senderAddr)
    const senderProxyIndex = this.proxies.access(sender)
    // TODO: why not working within a single `access`?
    const senderProxy = this.inner
      .into(ValueRune)
      .access("signatories")
      .access(senderProxyIndex)
    return MultiAddress.Id(senderProxy)
  }

  fundMemberProxy<X>(...[senderAddr, amount]: RunicArgs<X, [Uint8Array, bigint]>) {
    return Balances.transfer({
      dest: this.proxyBySenderAddr(senderAddr),
      value: amount,
    })
  }

  ratify<X>(...[senderAddr, call]: RunicArgs<X, [Uint8Array, Chain.Call<C>]>) {
    const sender = this.proxyBySenderAddr(senderAddr)
    const call_ = this.chain.extrinsic(Proxy.proxy({
      real: MultiAddress.Id(this.stash),
      forceProxyType: undefined,
      call,
    }))
    return Proxy.proxy({
      real: sender,
      forceProxyType: undefined,
      call: this.inner.ratify({ call: call_, sender }),
    })
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

  static deployment<C extends Chain, U, X>(
    chain: ChainRune<VirtualMultisigChain<C>, U>,
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
        chain.extrinsic(Proxy.createPure({
          proxyType: "Any",
          delay: 0,
          index,
        }))))
    ).into(MetaRune).flat()
    const proxies = (chain as any as ChainRune<EventsChain<C>, U>)
      .extrinsic(Utility.batchAll({ calls: proxyCreationCalls }))
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
          chain.extrinsic(Balances.transfer({
            dest: MultiAddress.Id(memberProxy),
            value,
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
      .into(MultisigRune, chain as ChainRune<MultisigChain<C>, U>)
    const multisigExistentialDepositCall = chain.extrinsic(Balances.transfer({
      dest: MultiAddress.Id(multisig.accountId),
      value: existentialDepositAmount,
    }))
    const stashDepositCall = chain.extrinsic(Balances.transfer({
      dest: MultiAddress.Id(stashProxy),
      value: existentialDepositAmount,
    }))

    const existentialDepositCalls = Rune
      .tuple([memberProxyExistentialDepositCalls, multisigExistentialDepositCall, stashDepositCall])
      .map(([a, b, c]) => [...a, b, c])
    const existentialDeposits = chain
      .extrinsic(Utility.batchAll({ calls: existentialDepositCalls }))
      .signed(signature({ sender: deployer }) as any)
      .sent()
      .dbgStatus("Existential deposits:")
      .finalized()

    const ownershipSwapCalls = Rune
      .tuple([deployer, memberAccountIds, memberProxies, stashProxy, multisig.address])
      .map(([deployer, memberAccountIds, memberProxies, stashProxy, multisigAddress]) =>
        Rune.array([
          ...replaceDelegateCalls(
            chain as ChainRune<ProxyChain<C>, U>,
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
                chain as ChainRune<ProxyChain<C>, U>,
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
      .extrinsic(Utility.batchAll({ calls: ownershipSwapCalls }))
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
