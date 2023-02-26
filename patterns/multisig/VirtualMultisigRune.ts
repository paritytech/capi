import { type Event as ProxyEvent } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { type RuntimeEvent } from "polkadot_dev/types/polkadot_runtime.ts"
import {
  ChainRune,
  Event,
  ExtrinsicSender,
  MetaRune,
  MultiAddress,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
import { replaceDelegateCalls } from "../proxy/mod.ts"
import { MultisigRune } from "./MultisigRune.ts"

export interface CreateVirtualMultisigProps {
  members: {
    origin: Uint8Array
    deposit?: bigint
  }[]
  deposit?: bigint
  threshold?: number
  configurator: ExtrinsicSender // TODO: use DI
}

export function createVirtualMultisig<U, X>(
  chain: ChainRune<U, any>,
  props: RunicArgs<X, CreateVirtualMultisigProps>,
) {
  const defaultDeposit = chain.metadata().pallet("Balances").const("ExistentialDeposit").decoded
  const members = Rune.resolve(props.members)
  const configurator = Rune.resolve(props.configurator)
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
    .tuple([props.members, memberProxies, defaultDeposit])
    .map(([members, memberProxies, defaultDeposit]) =>
      Rune.array(memberProxies.map((memberProxy, i) =>
        chain.extrinsic({
          type: "Balances",
          value: {
            type: "transfer",
            dest: MultiAddress.Id(memberProxy),
            value: members[i]!.deposit ?? defaultDeposit,
          },
        })
      ))
    )
    .into(MetaRune)
    .flat()
  const multisig = Rune
    .rec({
      signatories: memberProxies,
      threshold: Rune
        .resolve(props.threshold)
        .unhandle(undefined)
        .rehandle(undefined, () => membersCount),
    })
    .into(MultisigRune, chain)
  const multisigExistentialDepositCall = chain.extrinsic(Rune.rec({
    type: "Balances",
    value: Rune.rec({
      type: "transfer",
      dest: multisig.accountId.map(MultiAddress.Id),
      value: Rune
        .tuple([props.deposit, defaultDeposit])
        .map(([deposit, defaultDeposit]) => deposit ?? defaultDeposit),
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
    .tuple([configurator, members, memberProxies, stashProxy, multisig.accountId])
    .map(([configurator, members, memberProxies, stashProxy, multisigAccountId]) =>
      Rune.array([
        ...replaceDelegateCalls(
          chain,
          MultiAddress.Id(stashProxy),
          configurator.address,
          MultiAddress.Id(multisigAccountId),
        ),
        ...memberProxies.flatMap((proxy, i) =>
          replaceDelegateCalls(
            chain,
            MultiAddress.Id(proxy),
            configurator.address,
            MultiAddress.Id(members[i]!.origin),
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
