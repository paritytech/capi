import { types } from "polkadot_dev/mod.ts"
import { Proxy, Utility } from "polkadot_dev/mod.ts"
import { Event } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { RuntimeEvent } from "polkadot_dev/types/polkadot_runtime.ts"
import { ArrayRune, MultiAddress, Rune, RunicArgs } from "../mod.ts"
import { hex, Sr25519 } from "../util/mod.ts"

export interface BuildPureProxyMultisigProps {
  sender: Sr25519
  admins: Uint8Array[]
  threshold?: number
}

export function buildPureProxyMultisig<X1>(props: RunicArgs<X1, BuildPureProxyMultisigProps>) {
  // TODO: clean up with https://github.com/paritytech/capi/issues/589
  const { admins, threshold: thresholdOrUndef, sender } = RunicArgs.resolve(props)
  const adminCount = admins.map((admins) => admins.length)

  // TODO: validate threshold within acceptable range
  const threshold = Rune
    .resolve(thresholdOrUndef)
    .unhandle(undefined)
    .rehandle(undefined, () => adminCount)

  // Mapping from signatory public key to to-be-created stash account index
  const adminDisambiguationIndicesMap = admins.map((a) =>
    Object.fromEntries(a.map((publicKey, i) => [hex.encode(publicKey), i]))
  )

  const createPureCalls = adminCount
    .map((n) => Array.from({ length: n + 1 }, (_, i) => i))
    .into(ArrayRune)
    .mapArray((index) =>
      Proxy.createPure({
        proxyType: "Any",
        delay: 0,
        index,
      })
    )

  const proxyAccountIds = Utility
    .batch({ calls: createPureCalls })
    .signed({ sender })
    .sent()
    .dbgStatus("Creating pure proxies:")
    .txEvents()
    .pipe(filterPureCreatedEvents)
    .map((e): Record<number, Uint8Array> =>
      Object.fromEntries(e.map(({ disambiguationIndex, pure }) => [disambiguationIndex, pure]))
    )

  const stashMultiAddress = Rune
    .tuple([proxyAccountIds, adminCount])
    .map(([rec, i]) => rec[i]!)
    .map(MultiAddress.Id)

  const proxySignatoryAccountIds = Rune
    .tuple([adminCount, proxyAccountIds])
    .map(([stashIndex, indices]) => {
      const { [stashIndex]: _, ...rest } = indices
      return Object.values(rest)
    })
    .into(ArrayRune)

  const adminProxies = Rune.tuple([adminDisambiguationIndicesMap, proxyAccountIds])
    .map(([adminDisambiguationIndicesMap, proxyAddressMap]): Record<string, Uint8Array> =>
      Object.fromEntries(
        Object
          .keys(adminDisambiguationIndicesMap)
          .map((sig) => [sig, proxyAddressMap[adminDisambiguationIndicesMap[sig]!]!]),
      )
    )

  return Rune.rec({
    multisig: Rune.rec({
      signatories: proxySignatoryAccountIds,
      threshold,
    }),
    stashMultiAddress,
    adminProxies,
  })
}

export function addProxy<X>(
  ...[proxy, delegate]: RunicArgs<X, [proxy: MultiAddress, delegate: MultiAddress]>
) {
  return Proxy.proxy({
    real: proxy,
    forceProxyType: undefined,
    call: Proxy.addProxy({
      proxyType: "Any",
      delegate: delegate,
      delay: 0,
    }),
  })
}

export function removeProxy<X>(
  ...[proxy, delegate]: RunicArgs<X, [proxy: MultiAddress, delegate: MultiAddress]>
) {
  return Proxy.proxy({
    real: proxy,
    forceProxyType: undefined,
    call: Proxy.removeProxy({
      proxyType: "Any",
      delegate: delegate,
      delay: 0,
    }),
  })
}

export function getMultiAddress<X1>(
  ...[mapping]: RunicArgs<X1, [Record<string, Uint8Array>]>
) {
  return function<X2>(...[accountId]: RunicArgs<X2, [Uint8Array]>) {
    return Rune
      .tuple([mapping, accountId])
      .map(([mapping, accountId]) =>
        MultiAddress.Id(mapping[hex.encode(accountId)] ?? new Uint8Array())
      )
  }
}

export function filterPureCreatedEvents<X>(
  ...[events]: RunicArgs<X, [types.frame_system.EventRecord[]]>
) {
  return Rune
    .resolve(events)
    .map((events) =>
      events
        .map((e) => e.event)
        .filter(RuntimeEvent.isProxy)
        .map((e) => e.value)
        .filter(Event.isPureCreated)
    )
}
