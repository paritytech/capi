import { alice } from "capi"
import {
  ParasSudoWrapper,
  Sudo,
  System,
  types as relayTypes,
} from "zombienet/xcm_playground.toml/alice/@latest/mod.js"
import {
  Assets,
  // types as statemineTypes,
} from "zombienet/xcm_playground.toml/statemine-collator01/@latest/mod.js"
// import {
//   System,
//   types,
//   XcmPallet,
// } from "zombienet/xcm_playground.toml/trappist-collator01/@latest/mod.js"

const result = await System.Account.value(alice.publicKey).run()

console.log(result)

function setup() {
  const forceCreateAsset = Assets.forceCreate({
    id: 1,
    isSufficient: true,
    minBalance: 1n,
    owner: alice.address,
  })

  const createAsset = Sudo.sudo({
    call: ParasSudoWrapper.sudoQueueDownwardXcm({
      id: 1000,
      xcm: {
        type: "V2",
        value: [ // convert to Array<t.xcm.v2.Instruction>
          relayTypes.xcm.v2.Instruction.Transact({
            originType: "Superuser",
            requireWeightAtMost: 1000000000n,
            call: forceCreateAsset, // convert to t.xcm.double_encoded.DoubleEncoded
          }),
        ],
      },
    }),
  })

  return createAsset
}

if (import.meta.main) {
  await setup().run()
}
