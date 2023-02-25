import { ArrayRune, ChainRune, hex, MultiAddress, Rune, RunicArgs, Sr25519 } from "../../mod.ts"
import { filterPureCreatedEvents } from "../proxy/mod.ts"

export interface BuildPureProxyMultisigProps {
  sender: Sr25519
  admins: Uint8Array[]
  threshold?: number
}

export function createMultiproxy<U, X>(
  chain: ChainRune<U, any>, // TODO: constraint `Chain`
  props: RunicArgs<X, BuildPureProxyMultisigProps>,
) {
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
      chain.extrinsic({
        type: "Proxy",
        value: Rune.rec({
          type: "createPure",
          proxyType: "Any",
          delay: 0,
          index,
        }),
      })
    )

  const proxyAccountIds = chain
    .extrinsic({
      type: "Utility",
      value: {
        type: "batch",
        calls: createPureCalls,
      },
    })
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
