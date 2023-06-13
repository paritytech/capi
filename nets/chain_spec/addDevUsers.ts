import { blake2_512, Sr25519, ss58 } from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"
import { devUserPublicKeysData } from "../../util/_artifacts/devUserPublicKeysData.ts"
import { GenesisConfig } from "./ChainSpec.ts"

const devUserInitialFunds = 1_000_000_000_000_000_000

export const devUserPublicKeys = $.array($.sizedUint8Array(32)).decode(devUserPublicKeysData)

export function addDevUsers(genesisConfig: GenesisConfig) {
  if (!genesisConfig.balances) return
  const { balances } = genesisConfig.balances
  const networkPrefix = ss58.decode(balances[0]![0])[0]
  for (const publicKey of devUserPublicKeys) {
    balances.push([ss58.encode(networkPrefix, publicKey), devUserInitialFunds])
  }
}

export function devUser(userId: number) {
  return Sr25519.fromSeed64(blake2_512.hash(new TextEncoder().encode(`capi-dev-user-${userId}`)))
}
