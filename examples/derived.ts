import { ArrayRune, polkadot, Rune } from "http://localhost:5646/@local/mod.ts"

const Paras = polkadot.metadata().pallet("Paras")
const ids = Paras.storage("Parachains").entry([]).unsafeAs<number[]>().as(ArrayRune)
const root = ids.mapArray((id) => {
  return Paras.storage("Heads").entry(Rune.ls([id]))
})

console.log(await root.run())
