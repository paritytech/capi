import { alice, ArrayRune, bob, charlie, dave, MultiAddress, Rune } from "capi"
import {
  addProxy,
  buildPureProxyMultisig,
  getMultiAddress,
  removeProxy,
} from "capi/patterns/proxy.ts"
import { Balances, chain, Proxy, System, Utility } from "polkadot_dev/mod.ts"
import { MultisigRune } from "../patterns/MultisigRune.ts"

const build = buildPureProxyMultisig({
  sender: alice,
  threshold: 2,
  admins: [alice.publicKey, bob.publicKey, charlie.publicKey],
})

const multisig = build.access("multisig").into(MultisigRune, chain)
const stashMultiAddress = build.access("stashMultiAddress")
const adminProxies = build.access("adminProxies")

const existentialDepositAddresses = Rune.tuple([
  multisig.address.map(MultiAddress.Id),
  stashMultiAddress,
  adminProxies.map((rec) => Object.values(rec).map(MultiAddress.Id)),
]).map(([a, b, c]) => [a, b, ...c])

const existentialDeposits = Utility.batchAll({
  calls: existentialDepositAddresses.into(ArrayRune).mapArray((addr) =>
    Balances.transfer({
      dest: addr,
      value: 20_000_000_000_000n,
    })
  ),
}).signed({ sender: alice })
  .sent()
  .logStatus("Existential deposits:")
  .txEvents()

const getProxyAddress = getMultiAddress(adminProxies)
const aliceProxyAddress = getProxyAddress(alice.publicKey)
const bobProxyAddress = getProxyAddress(bob.publicKey)
const charlieProxyAddress = getProxyAddress(charlie.publicKey)

const updateProxies = Utility
  .batchAll({
    calls: Rune.tuple([
      addProxy(bobProxyAddress, bob.address),
      addProxy(charlieProxyAddress, charlie.address),
      addProxy(stashMultiAddress, multisig.address.map(MultiAddress.Id)),
      removeProxy(bobProxyAddress, alice.address),
      removeProxy(charlieProxyAddress, alice.address),
      removeProxy(stashMultiAddress, alice.address),
    ]),
  }).signed({ sender: alice })
  .sent()
  .logStatus("Update Proxies")
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
  .logStatus("Ratify Proposal Alice:")
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
  .logStatus("Ratify Proposal Bob:")
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
