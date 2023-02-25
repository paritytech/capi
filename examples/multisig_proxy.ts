import {
  alice,
  ArrayRune,
  bob,
  charlie,
  dave,
  hex,
  MultiAddress,
  Rune,
  RunicArgs,
  ValueRune,
} from "capi"
import { createMultiproxy, MultisigRune } from "capi/patterns/multisig/mod.ts"
import { addProxy, removeProxy } from "capi/patterns/proxy/mod.ts"
import { Balances, chain, Proxy, System, Utility } from "polkadot_dev/mod.ts"

const build = createMultiproxy(chain, {
  sender: alice,
  threshold: 2,
  admins: [alice.publicKey, bob.publicKey, charlie.publicKey],
})

const multisig = build.access("multisig").into(MultisigRune, chain)
const stashMultiAddress = build.access("stashMultiAddress")
const adminProxies = build.access("adminProxies")

const existentialDepositAddresses = Rune
  .tuple([
    multisig.address.map(MultiAddress.Id),
    stashMultiAddress,
    adminProxies.map((rec) => Object.values(rec).map(MultiAddress.Id)),
  ])
  .map(([a, b, c]) => [a, b, ...c])

const existentialDeposits = Utility
  .batchAll({
    calls: existentialDepositAddresses
      .into(ArrayRune)
      .mapArray((dest) => Balances.transfer({ dest, value: 20_000_000_000_000n })),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Existential deposits:")
  .txEvents()

function getProxyAddress<X>(...[accountId]: RunicArgs<X, [Uint8Array]>) {
  return Rune
    .tuple([adminProxies, accountId])
    .map(([adminProxies, accountId]) =>
      MultiAddress.Id(adminProxies[hex.encode(accountId)] ?? new Uint8Array())
    )
}
const aliceProxyAddress = getProxyAddress(alice.publicKey)
const bobProxyAddress = getProxyAddress(bob.publicKey)
const charlieProxyAddress = getProxyAddress(charlie.publicKey)

const updateProxies = Utility
  .batchAll({
    calls: Rune.array([
      addProxy(chain, bobProxyAddress, bob.address),
      addProxy(chain, charlieProxyAddress, charlie.address),
      addProxy(chain, stashMultiAddress, multisig.address.map(MultiAddress.Id)),
      removeProxy(chain, bobProxyAddress, alice.address),
      removeProxy(chain, charlieProxyAddress, alice.address),
      removeProxy(chain, stashMultiAddress, alice.address),
    ] as any[]),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Update Proxies")
  .txEvents()

const proposalCall = Proxy.proxy({
  real: stashMultiAddress,
  forceProxyType: undefined,
  call: Balances.transferKeepAlive({
    dest: dave.address,
    value: 1_234_000_000_000n,
  }),
})

const aliceRatify = Proxy
  .proxy({
    real: aliceProxyAddress,
    forceProxyType: undefined,
    call: multisig.ratify({
      call: proposalCall,
      sender: aliceProxyAddress,
    }),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Ratify Proposal Alice:")
  .finalized()

const bobRatify = Proxy
  .proxy({
    real: bobProxyAddress,
    forceProxyType: undefined,
    call: multisig.ratify({
      call: proposalCall,
      sender: bobProxyAddress,
    }),
  })
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Ratify Proposal Bob:")
  .finalized()

const daveBalance = System.Account.entry([dave.publicKey])

console.log(
  await existentialDepositAddresses
    .chain(() => existentialDeposits)
    .chain(() => updateProxies)
    .chain(() => aliceRatify)
    .chain(() => bobRatify)
    .chain(() => daveBalance)
    .run(),
)
