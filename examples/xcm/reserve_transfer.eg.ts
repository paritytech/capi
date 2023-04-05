/**
 * @title XCM Reserve Asset Transfer
 * @stability nearing
 * @description Perform an XCM reserve asset transfer, in which two chains, which
 * do not trust one another, rely on a third chain to store assets and facilitate
 * the exchange.
 */

import { alice, bob, hex, Rune, ValueRune } from "capi"
import { signature } from "capi/patterns/signature/statemint.ts"
import * as Rococo from "zombienet/trappist.toml/alice/@latest/mod.js"
import * as Statemine from "zombienet/trappist.toml/statemine-collator01/@latest/mod.js"
import * as Trappist from "zombienet/trappist.toml/trappist-collator01/@latest/mod.js"
import { waitFor } from "../../util/mod.ts"

// Define some constants, which we'll make use of later.
const RESERVE_ASSET_ID = 1
const RESERVE_CHAIN_ID = 1000 // Statemine
const TRAPPIST_ASSET_ID = RESERVE_ASSET_ID
const TRAPPIST_CHAIN_ID = 2000

// Create a sufficient asset with Sudo. When targeting a common good
// parachain, access root instead through the relay chain.
await Rococo.Sudo
  .sudo({
    call: Rococo.ParasSudoWrapper.sudoQueueDownwardXcm({
      id: RESERVE_CHAIN_ID,
      xcm: Rune.rec({
        type: "V2",
        value: Rune.tuple([
          Rococo.types.xcm.v2.Instruction.Transact({
            originType: "Superuser",
            requireWeightAtMost: 1000000000n,
            call: Rune.rec({
              encoded: Statemine.Assets.forceCreate({
                id: RESERVE_ASSET_ID,
                isSufficient: true,
                minBalance: 1n,
                owner: alice.address,
              }).call,
            }),
          }),
        ]),
      }),
    }),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Rococo(root) > Statemine(root): Create asset")
  .finalized()
  .run()

await waitFor(async () =>
  (await Statemine.Assets.Asset.value(RESERVE_ASSET_ID).run()) !== undefined
)
console.log(
  "Statemine: Asset created",
  await Statemine.Assets.Asset.value(RESERVE_ASSET_ID).run(),
)

// Mint assets on Reserve Parachain.
await Statemine.Assets
  .mint({
    id: RESERVE_ASSET_ID,
    amount: 100000000000000n,
    beneficiary: bob.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Statemine(Alice): Mint reserve asset to Bob")
  .finalized()
  .run()

const bobStatemintBalance = Statemine.Assets.Account
  .value([RESERVE_ASSET_ID, bob.publicKey])
  .unhandle(undefined)
  .access("balance")

const bobStatemintBalanceInitial = await bobStatemintBalance.run()
console.log("Statemine(Bob): asset balance", bobStatemintBalanceInitial)

// Create the asset on the Trappist Parachain.
await Trappist.Sudo
  .sudo({
    call: Trappist.Assets.forceCreate({
      id: TRAPPIST_ASSET_ID,
      isSufficient: false,
      minBalance: 1n,
      owner: alice.address,
    }),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Trappist(root): Create derived asset")
  .finalized()
  .run()

// Register Trappist parachain asset id to reserve asset id.
{
  const { v1: { junction: { Junction }, multilocation } } = Trappist.types.xcm
  await Trappist.Sudo
    .sudo({
      call: Trappist.AssetRegistry.registerReserveAsset({
        assetId: TRAPPIST_ASSET_ID,
        assetMultiLocation: Rune.rec({
          parents: 1,
          interior: multilocation.Junctions.X3(
            Junction.Parachain(RESERVE_CHAIN_ID),
            Junction.PalletInstance((await Statemine.Assets.pallet.run()).id),
            Junction.GeneralIndex(BigInt(RESERVE_ASSET_ID)),
          ),
        }),
      }),
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Trappist(root): Register AssetId to Reserve AssetId")
    .finalized()
    .run()
}

// Reserve transfer asset id on reserve parachain to Trappist parachain.
{
  const {
    xcm: {
      VersionedMultiLocation,
      VersionedMultiAssets,
      v0: { junction: { NetworkId } },
      v1: {
        junction: { Junction },
        multilocation: { Junctions },
        multiasset: { AssetId, Fungibility },
      },
      v2: { WeightLimit },
    },
    statemine_runtime: { RuntimeEvent },
    cumulus_pallet_xcmp_queue: { pallet: { Event } },
  } = Statemine.types
  await Statemine.PolkadotXcm
    .limitedReserveTransferAssets({
      dest: VersionedMultiLocation.V1(Rune.rec({
        parents: 1,
        interior: Junctions.X1(
          Junction.Parachain(TRAPPIST_CHAIN_ID),
        ),
      })),
      beneficiary: VersionedMultiLocation.V1(Rune.rec({
        parents: 0,
        interior: Junctions.X1(
          Junction.AccountId32({
            network: NetworkId.Any(),
            id: bob.publicKey,
          }),
        ),
      })),
      assets: VersionedMultiAssets.V1(Rune.array([Rune.rec({
        id: AssetId.Concrete(Rune.rec({
          parents: 0,
          interior: Junctions.X2(
            Junction.PalletInstance((await Statemine.Assets.pallet.run()).id),
            Junction.GeneralIndex(BigInt(RESERVE_ASSET_ID)),
          ),
        })),
        fun: Fungibility.Fungible(10000000000000n),
      })])),
      feeAssetItem: 0,
      weightLimit: WeightLimit.Unlimited(),
    })
    .signed(signature({ sender: bob }))
    .sent()
    .dbgStatus("Statemine(Bob): Reserve transfer to Trappist")
    .finalizedEvents()
    .into(ValueRune)
    .map((events) => {
      const event = events
        .find((e) => RuntimeEvent.isXcmpQueue(e.event) && Event.isXcmpMessageSent(e.event.value))
        ?.event.value as
          | Statemine.types.cumulus_pallet_xcmp_queue.pallet.Event.XcmpMessageSent
          | undefined
      return event?.messageHash ? hex.encode(event.messageHash) : event
    })
    .dbg("XcmpMessageSent.messageHash")
    .run()
}

const bobTrappistAssetAccount = Trappist.Assets.Account.value([TRAPPIST_ASSET_ID, bob.publicKey])

await waitFor(async () => !!await bobTrappistAssetAccount.run())

const bobTrappistBalance = await bobTrappistAssetAccount
  .unhandle(undefined)
  .access("balance")
  .run()
console.log("Trappist(Bob): asset balance:", bobTrappistBalance)

const bobStatemintBalanceFinal = await bobStatemintBalance.run()
console.log("Statemine(Bob): asset balance:", bobStatemintBalanceFinal)

const statemintSovereignAccountBalance = await Statemine.Assets.Account
  // Sovereign address on sibling chain
  // b"sibl" + $.u32.encode(2000) + 0...0
  .value([
    RESERVE_ASSET_ID,
    hex.decode("0x7369626cd0070000000000000000000000000000000000000000000000000000"),
  ])
  .run()
console.log("Statemine(TrappistSovereignAccount): asset balance", statemintSovereignAccountBalance)
