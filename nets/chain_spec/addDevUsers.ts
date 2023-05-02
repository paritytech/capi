import { ss58 } from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"
import { devUserPublicKeysData } from "../../util/_artifacts/devUserPublicKeysData.ts"

const devUserInitialFunds = 1_000_000_000_000_000_000

export const devUserPublicKeys = $.array($.sizedUint8Array(32)).decode(devUserPublicKeysData)

export function addDevUsers(balances: [string, number][]) {
  const networkPrefix = ss58.decode(balances[0]![0])[0]
  for (const publicKey of devUserPublicKeys) {
    balances.push([ss58.encode(networkPrefix, publicKey), devUserInitialFunds])
  }
}
