/**
 * @title XCM Reserve Asset Transfer
 * @stability unstable
 * @description Perform an XCM reserve asset transfer, in which two chains, which
 * do not trust one another, rely on a third chain to store assets and facilitate
 * the exchange.
 * @test_skip
 */

import { chain as rococo, DoubleEncoded, Instruction } from "@capi/rococo-dev-xcm"
import {
  $assetDetails,
  AssetId,
  chain as statemine,
  CumulusPalletXcmpQueueEvent,
  Fungibility,
  Junctions,
  NetworkId,
  RuntimeEvent,
  VersionedMultiAssets,
  VersionedMultiLocation,
  VersionedXcm,
  WeightLimit,
  XcmV1Junction,
  XcmV1MultiAsset,
  XcmV1MultiLocation,
} from "@capi/rococo-dev-xcm/statemine"
import { chain as trappist } from "@capi/rococo-dev-xcm/trappist"
import { assert, assertNotEquals } from "asserts"
import { $, alice as root, createDevUsers, Rune, ValueRune } from "capi"
import { $siblId } from "capi/patterns/para_id.ts"
import { signature } from "capi/patterns/signature/statemint.ts"
import { retry } from "../../deps/std/async.ts"

const { alexa, billy } = await createDevUsers()

/// Define some constants for later use.
const RESERVE_ASSET_ID = 1
const RESERVE_CHAIN_ID = 1000 // Statemine
const TRAPPIST_ASSET_ID = RESERVE_ASSET_ID
const TRAPPIST_CHAIN_ID = 2000

/// Define some common options to be used along with `retry`,
/// which will poll for XCM-resulting changes.
const retryOptions = {
  multiplier: 1,
  maxAttempts: Infinity,
  maxTimeout: 2 * 60 * 1000,
}

// HEAD
/// Create a sufficient asset with Sudo. When targeting a common good
/// parachain, access root instead through the relay chain.
await Rococo.Sudo
//
// Create a sufficient asset with Sudo. When targeting a common good
// parachain, access root instead through the relay chain.
await rococo.Sudo
  // ae8aa6c (clean up reserve transfer example)
  .sudo({
    call: rococo.ParasSudoWrapper.sudoQueueDownwardXcm({
      id: RESERVE_CHAIN_ID,
      xcm: VersionedXcm.V2(
        Rune.array([
          Instruction.Transact({
            originType: "Superuser",
            requireWeightAtMost: 1000000000n,
            call: DoubleEncoded({
              encoded: statemine.Assets.forceCreate({
                id: RESERVE_ASSET_ID,
                isSufficient: true,
                minBalance: 1n,
                owner: alexa.address,
              }).callData,
            }),
          }),
        ]),
      ),
    }),
  })
  .signed(signature({ sender: root }))
  .sent()
  .dbgStatus("Rococo(root) > Statemine(root): Create asset")
  .finalized()
  .run()

/// Wait for the asset to be recorded in storage.
const assetDetails = await retry(
  () => statemine.Assets.Asset.value(RESERVE_ASSET_ID).unhandle(undefined).run(),
  retryOptions,
)

/// Ensure the reserve asset was created.
console.log("Statemine: Asset created", assetDetails)
$.assert($assetDetails, assetDetails)

/// Mint assets on reserve parachain.
await statemine.Assets
  .mint({
    id: RESERVE_ASSET_ID,
    amount: 100000000000000n,
    beneficiary: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Statemine(Alexa): Mint reserve asset to Billy")
  .finalized()
  .run()

const billyStatemintBalance = statemine.Assets.Account
  .value([RESERVE_ASSET_ID, billy.publicKey])
  .unhandle(undefined)
  .access("balance")

const billyStatemintBalanceInitial = await billyStatemintBalance.run()
console.log("Statemine(Billy): asset balance", billyStatemintBalanceInitial)
$.assert($.u128, billyStatemintBalanceInitial)

/// Create the asset on the Trappist parachain.
await trappist.Sudo
  .sudo({
    call: trappist.Assets.forceCreate({
      id: TRAPPIST_ASSET_ID,
      isSufficient: false,
      minBalance: 1n,
      owner: alexa.address,
    }),
  })
  .signed(signature({ sender: root }))
  .sent()
  .dbgStatus("Trappist(root): Create derived asset")
  .finalized()
  .run()

/// Register Trappist parachain asset id to reserve asset id.
await trappist.Sudo
  .sudo({
    call: trappist.AssetRegistry.registerReserveAsset({
      assetId: TRAPPIST_ASSET_ID,
      assetMultiLocation: XcmV1MultiLocation({
        parents: 1,
        interior: Junctions.X3(
          XcmV1Junction.Parachain(RESERVE_CHAIN_ID),
          XcmV1Junction.PalletInstance((await statemine.Assets.pallet.run()).id),
          XcmV1Junction.GeneralIndex(BigInt(RESERVE_ASSET_ID)),
        ),
      }),
    }),
  })
  .signed(signature({ sender: root }))
  .sent()
  .dbgStatus("Trappist(root): Register AssetId to Reserve AssetId")
  .finalized()
  .run()

// Reserve transfer asset id on reserve parachain to Trappist parachain.
const events = await statemine.PolkadotXcm
  .limitedReserveTransferAssets({
    dest: VersionedMultiLocation.V1(XcmV1MultiLocation({
      parents: 1,
      interior: Junctions.X1(
        XcmV1Junction.Parachain(TRAPPIST_CHAIN_ID),
      ),
    })),
    beneficiary: VersionedMultiLocation.V1(XcmV1MultiLocation({
      parents: 0,
      interior: Junctions.X1(
        XcmV1Junction.AccountId32({
          network: NetworkId.Any(),
          id: billy.publicKey,
        }),
      ),
    })),
    assets: VersionedMultiAssets.V1(Rune.array([XcmV1MultiAsset({
      id: AssetId.Concrete(XcmV1MultiLocation({
        parents: 0,
        interior: Junctions.X2(
          XcmV1Junction.PalletInstance((await statemine.Assets.pallet.run()).id),
          XcmV1Junction.GeneralIndex(BigInt(RESERVE_ASSET_ID)),
        ),
      })),
      fun: Fungibility.Fungible(10000000000000n),
    })])),
    feeAssetItem: 0,
    weightLimit: WeightLimit.Unlimited(),
  })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Statemine(Billy): Reserve transfer to Trappist")
  .finalizedEvents()
  .run()

for (const { event } of events) {
  if (
    RuntimeEvent.isXcmpQueue(event) && CumulusPalletXcmpQueueEvent.isXcmpMessageSent(event.value)
  ) console.log("XcmpMessageSent.messageHash:", event.value)
}

/// Retrieve billy's balance on Trappist.
const { balance: billyTrappistBalance } = await retry(
  () =>
    trappist.Assets.Account
      .value([TRAPPIST_ASSET_ID, billy.publicKey])
      .unhandle(undefined)
      .run(),
  retryOptions,
)

/// Ensure the balance is greater than zero.
console.log("Trappist(Billy): asset balance:", billyTrappistBalance)
assert(billyTrappistBalance > 0)

/// Retrieve Billy's balance on statemint.
const billyStatemintBalanceFinal = await billyStatemintBalance.run()

/// Ensure the balance is different from the initial.
console.log("Statemine(Billy): asset balance:", billyStatemintBalanceFinal)
assertNotEquals(billyStatemintBalanceInitial, billyStatemintBalanceFinal)

// Retrieve the statemint sovereign account balance.
const statemintSovereignAccountBalance = await statemine.Assets.Account
  .value([RESERVE_ASSET_ID, $siblId.encode(TRAPPIST_CHAIN_ID)])
  .unhandle(undefined)
  .access("balance")
  .run()

/// Ensure the balance is greater than zero.
console.log("Statemine(TrappistSovereignAccount): asset balance", statemintSovereignAccountBalance)
assert(statemintSovereignAccountBalance > 0)
