import { ss58 } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { testUserPublicKeysData } from "../util/_artifacts/testUserPublicKeysData.ts"

const testUserInitialFunds = 1_000_000_000_000_000_000

export const testUserPublicKeys = $.array($.sizedUint8Array(32)).decode(testUserPublicKeysData)

export async function addTestUsers(balances: [string, number][]) {
  const networkPrefix = ss58.decode(balances[0]![0])[0]
  for (const publicKey of testUserPublicKeys) {
    balances.push([ss58.encode(networkPrefix, publicKey), testUserInitialFunds])
  }
}
