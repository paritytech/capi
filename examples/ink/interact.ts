// TODO: get this working again
import { alice } from "capi"
import { chain } from "contracts_dev/mod.js"
import { parse } from "../../deps/std/flags.ts"
import { InkMetadataRune } from "../../patterns/ink/mod.ts"
import { signature } from "../../patterns/signature/polkadot.ts"

let { address } = parse(Deno.args, { string: ["address"] })
if (!address) {
  await import("./deploy.ts")
  address = Deno.env.get("CONTRACT_ADDRESS")!
}

const metadataText = Deno.readTextFileSync(new URL("./metadata.json", import.meta.url))
export const contract = InkMetadataRune
  .fromMetadataText(metadataText)
  .instanceFromSs58(chain, address)

const state = contract.call({
  sender: alice.publicKey,
  method: "get",
})

console.log("State before:", await state.run())

await (contract
  .tx({ sender: alice.publicKey, method: "flip" })
  .signed(signature({ sender: alice }) as any) // TODO
  .sent()
  .dbgStatus("Flip status:") as any) // TODO
  .inBlockEvents()
  .pipe(contract.filterContractEvents)
  .run()

console.log("State after:", await state.run())
