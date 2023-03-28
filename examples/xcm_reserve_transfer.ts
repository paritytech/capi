import {
  alice,
  bob,
  Chain,
  ChainRune,
  Era,
  ExtrinsicSender,
  hex,
  Rune,
  RunicArgs,
  SignatureData,
  ss58,
  ValueRune,
} from "capi"
import * as Rococo from "zombienet/trappist.toml/alice/@latest/mod.js"
import * as Statemine from "zombienet/trappist.toml/statemine-collator01/@latest/mod.js"
import * as Trappist from "zombienet/trappist.toml/trappist-collator01/@latest/mod.js"
import { delay } from "../deps/std/async.ts"

/**
 * Reserve Transfer Asset example steps
 * - Create a sufficient Asset on Reserve Parachain
 * - Mint assets on Reserve Parachain
 * - Create asset on Trappist Parachain
 * - Register Trappist Parachain AssetId to Reserve AssetId
 * - Reserve transfer AssetId on Reserve Parachain to Trappist Parachain
 */

const RESERVE_ASSET_ID = 1
const RESERVE_CHAIN_ID = 1000 // Statemine
const TRAPPIST_ASSET_ID = RESERVE_ASSET_ID
const TRAPPIST_CHAIN_ID = 2000
const RESERVE_ASSET_AMOUNT_TO_MINT = 100000000000000n
const RESERVE_ASSET_AMOUNT_TO_SEND = 10000000000000n

// In Statemine, root is needed to create a sufficient asset
// In a common good parachain, root is accessed through the relay chain
await Rococo.Sudo.sudo({
  call: Rococo.ParasSudoWrapper.sudoQueueDownwardXcm({
    id: RESERVE_CHAIN_ID,
    xcm: Rune.rec({
      type: "V2",
      value: Rune.array([
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

await Statemine.Assets.mint({
  id: RESERVE_ASSET_ID,
  amount: RESERVE_ASSET_AMOUNT_TO_MINT,
  beneficiary: bob.address,
})
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Statemine(Alice): Mint reserve asset to Bob")
  .finalized()
  .run()

console.log(
  "Statemine(Bob): asset balance",
  await Statemine.Assets.Account.value([RESERVE_ASSET_ID, bob.publicKey]).run(),
)

await Trappist.Sudo.sudo({
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

{
  const {
    v1: {
      junction: { Junction },
      multilocation: { Junctions },
    },
  } = Trappist.types.xcm
  // TODO: batch with createDerivedAsset
  await Trappist.Sudo.sudo({
    call: Trappist.AssetRegistry.registerReserveAsset({
      assetId: TRAPPIST_ASSET_ID,
      assetMultiLocation: Rune.rec({
        parents: 1,
        interior: Junctions.X3(
          // TODO: find parachain id
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
  await Statemine.PolkadotXcm.limitedReserveTransferAssets({
    dest: VersionedMultiLocation.V1(Rune.rec({
      parents: 1,
      interior: Junctions.X1(
        // TODO: find parachain id
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
      fun: Fungibility.Fungible(RESERVE_ASSET_AMOUNT_TO_SEND),
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
      const event = events.find((e) =>
        RuntimeEvent.isXcmpQueue(e.event)
        && Event.isXcmpMessageSent(e.event.value)
      )?.event.value as
        | Statemine.types.cumulus_pallet_xcmp_queue.pallet.Event.XcmpMessageSent
        | undefined
      if (event?.messageHash) {
        return hex.encode(event.messageHash)
      }
      return event
    })
    .dbg("XcmpMessageSent.messageHash")
    .run()
}

// TODO: wait for xcmpQueue.(Success|Fail) .messageHash
await waitFor(async () =>
  await Trappist.Assets.Account.value([TRAPPIST_ASSET_ID, bob.publicKey]).run() !== undefined
)
console.log(
  "Trappist(Bob): asset balance",
  await Trappist.Assets.Account.value([TRAPPIST_ASSET_ID, bob.publicKey]).run(),
)
console.log(
  "Statemine(Bob): asset balance",
  await Statemine.Assets.Account.value([RESERVE_ASSET_ID, bob.publicKey]).run(),
)
console.log(
  "Statemine(TrappistSovereignAccount): asset balance",
  await Statemine.Assets.Account.value([
    RESERVE_ASSET_ID,
    // Sovereign address on sibling chain
    // b"sibl" + $.u32.encode(2000) + 0...0
    hex.decode("0x7369626cd0070000000000000000000000000000000000000000000000000000"),
  ]).run(),
)

async function waitFor(
  fn: () => Promise<boolean>,
  delay_ = 1000,
  maxAttempts = 60,
) {
  let attempts = 0
  while (attempts++ < maxAttempts) {
    if (await fn()) return
    await delay(delay_)
  }
  throw new Error("waitFor maxAttempts reached")
}

interface SignatureProps<T extends Chain> {
  sender: ExtrinsicSender<T>
  checkpoint?: string
  mortality?: Era
  nonce?: number
  tip?: bigint
}

function signature<X, C extends Chain>(_props: RunicArgs<X, SignatureProps<C>>) {
  return <CU>(chain: ChainRune<C, CU>) => {
    const props = RunicArgs.resolve(_props)
    // @ts-ignore FIXME:
    const addrPrefix = chain.addressPrefix()
    const versions = chain.pallet("System").constant("Version").decoded
    const specVersion = versions.access("specVersion")
    const transactionVersion = versions.access("transactionVersion")
    // TODO: create union rune (with `matchTag` method) and utilize here
    // TODO: MultiAddress conversion utils
    const senderSs58 = Rune
      .tuple([addrPrefix, props.sender])
      .map(([addrPrefix, sender]) => {
        switch (sender.address.type) {
          case "Id": {
            return ss58.encode(addrPrefix, sender.address.value)
          }
          default: {
            throw new Error("unimplemented")
          }
        }
      })
      .throws(ss58.InvalidPayloadLengthError)
    const nonce = Rune.resolve(props.nonce)
      .unhandle(undefined)
      .rehandle(undefined, () => chain.connection.call("system_accountNextIndex", senderSs58))
    const genesisHashHex = chain.connection.call("chain_getBlockHash", 0).unsafeAs<string>()
      .into(ValueRune)
    const genesisHash = genesisHashHex.map(hex.decode)
    const checkpointHash = Rune.tuple([props.checkpoint, genesisHashHex]).map(([a, b]) => a ?? b)
      .map(hex.decode)
    const mortality = Rune.resolve(props.mortality).map((x) => x ?? Era.Immortal)
    const tip = Rune.resolve(props.tip).map((x) => x ?? 0n)
    return Rune.rec({
      sender: props.sender,
      extra: Rune.rec({
        CheckMortality: mortality,
        CheckNonce: nonce,
        ChargeTransactionPayment: tip,
        ChargeAssetTxPayment: Rune.rec({
          // FIXME:
          // assetId: props.assetId,
          tip: tip,
        }),
      }),
      additional: Rune.rec({
        CheckSpecVersion: specVersion,
        CheckTxVersion: transactionVersion,
        CheckGenesis: genesisHash,
        CheckMortality: checkpointHash,
      }),
      // @ts-ignore FIXME:
    }) satisfies Rune<SignatureData<C>, unknown>
  }
}
