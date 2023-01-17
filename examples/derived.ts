import * as C from "http://localhost:5646/@local/mod.ts"
import { Rune } from "http://localhost:5646/@local/rune/rune.ts"

const Paras = C.polkadot.metadata().pallet("Paras")
const ids = Paras.storage("Parachains").entry([]).as<number[]>()
const root = ids.mapArray((id) => {
  return Paras.storage("Heads").entry(Rune.ls([id]))
})

console.log(await root.run())
