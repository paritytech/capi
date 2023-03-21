import {
  alice,
  bob,
  Chain,
  ChainRune,
  Era,
  hex,
  Rune,
  RunicArgs,
  SignatureData,
  ss58,
  ValueRune,
} from "capi"
import * as Rococo from "zombienet/xcm_playground.toml/alice/@latest/mod.js"
import * as Statemine from "zombienet/xcm_playground.toml/statemine-collator01/@latest/mod.js"
import * as Trappist from "zombienet/xcm_playground.toml/trappist-collator01/@latest/mod.js"
import { delay } from "../deps/std/async.ts"
import { SignatureProps } from "../patterns/signature/polkadot.ts"

const ASSET_ID = 1
const TRAPPIST_ASSET_ID = ASSET_ID
const ASSET_AMOUNT_TO_MINT = 100000000000000n
const ASSET_AMOUNT_TO_SEND = 10000000000000n

// await sanity()
await setup()
await doReserveTransfer()

async function setup() {
  const forceCreateAssetTransactEncodedCall = await Statemine.Assets.forceCreate({
    id: ASSET_ID,
    isSufficient: true,
    minBalance: 1n,
    owner: alice.address,
  }).call
    // TODO: .map() to relayTypes.xcm.v2.Instruction.Transact or t.xcm.double_encoded.DoubleEncoded
    .run()

  const createReserveAsset = Rococo.Sudo.sudo({
    call: Rococo.ParasSudoWrapper.sudoQueueDownwardXcm({
      id: 1000,
      xcm: Rune.rec({
        type: "V2",
        value: Rune.array([
          Rococo.types.xcm.v2.Instruction.Transact({
            originType: "Superuser",
            requireWeightAtMost: 1000000000n,
            // TODO: convert to t.xcm.double_encoded.DoubleEncoded
            call: {
              encoded: forceCreateAssetTransactEncodedCall,
            },
          }),
        ]),
      }),
    }),
  })

  await createReserveAsset
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("ParasSudoWrapper.sudoQueueDownwardXcm")
    .finalizedEvents()
    .run()

  await waitFor(async () => (await Statemine.Assets.Asset.value(ASSET_ID).run()) !== undefined) // wait for asset id created
  console.log("asset created", await Statemine.Assets.Asset.value(ASSET_ID).run())

  const mintAsset = Statemine.Assets.mint({
    id: ASSET_ID,
    amount: ASSET_AMOUNT_TO_MINT,
    beneficiary: bob.address,
  })

  await mintAsset
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("mint reserve asset")
    .finalizedEvents()
    .run()

  console.log("reserve asset minted", await Statemine.Assets.Asset.value(ASSET_ID).run())
  console.log(
    "bob reserve asset balance",
    await Statemine.Assets.Account.value([ASSET_ID, bob.publicKey]).run(),
  )

  const createDerivedAsset = Trappist.Sudo.sudo({
    call: Trappist.Assets.forceCreate({
      id: TRAPPIST_ASSET_ID,
      isSufficient: false,
      minBalance: 1n,
      owner: alice.address,
    }),
  })

  await createDerivedAsset
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("create derived asset")
    .finalizedEvents()
    .run()

  const {
    v1: {
      junction: { Junction },
      multilocation: { Junctions },
    },
  } = Trappist.types.xcm
  // TODO: batch with createDerivedAsset
  const registerReserveAsset = Trappist.Sudo.sudo({
    call: Trappist.AssetRegistry.registerReserveAsset({
      assetId: TRAPPIST_ASSET_ID,
      assetMultiLocation: Rune.rec({
        parents: 1,
        interior: Junctions.X3(
          // TODO: find parachain id
          Junction.Parachain(1000),
          Junction.PalletInstance((await Statemine.Assets.pallet.run()).id),
          Junction.GeneralIndex(BigInt(ASSET_ID)),
        ),
      }),
    }),
  })

  await registerReserveAsset
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("register reserve asset")
    .finalizedEvents()
    .run()
}

async function doReserveTransfer() {
  const {
    VersionedMultiLocation,
    VersionedMultiAssets,
    v0: { junction: { NetworkId } },
    v1: {
      junction: { Junction },
      multilocation: { Junctions },
      multiasset: { AssetId, Fungibility },
    },
    v2: { WeightLimit },
  } = Statemine.types.xcm
  const limitedReserveTransferAssets = Statemine.PolkadotXcm.limitedReserveTransferAssets({
    dest: VersionedMultiLocation.V1(Rune.rec({
      parents: 1,
      interior: Junctions.X1(
        // TODO: find parachain id
        Junction.Parachain(2000),
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
          Junction.GeneralIndex(BigInt(ASSET_ID)),
        ),
      })),
      fun: Fungibility.Fungible(ASSET_AMOUNT_TO_SEND),
    })])),
    feeAssetItem: 0,
    weightLimit: WeightLimit.Unlimited(),
  })

  await limitedReserveTransferAssets
    .signed(signature({ sender: bob }))
    .sent()
    .dbgStatus("limitedReserveTransferAssets")
    // TODO: from xcmpQueue.XcmpMessageSent get .messageHash
    .finalizedEvents()
    .run()

  // TODO: wait for xcmpQueue.(Success|Fail) .messageHash
  await waitFor(async () =>
    await Trappist.Assets.Account.value([TRAPPIST_ASSET_ID, bob.publicKey]).run() !== undefined
  ) // wait for bob balance to update
  console.log(
    "Trappist Bob asset balance",
    await Trappist.Assets.Account.value([TRAPPIST_ASSET_ID, bob.publicKey]).run(),
  )
}

async function waitFor(
  fn: () => Promise<boolean>,
  delay_ = 1000,
) {
  while (true) {
    const result = await fn()
    if (result) break
    await delay(delay_)
  }
}

async function _sanity() {
  console.log(await Rococo.System.Account.value(alice.publicKey).run())
  console.log(await Statemine.System.Account.value(alice.publicKey).run())
  console.log(await Trappist.System.Account.value(alice.publicKey).run())
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
