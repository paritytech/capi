import * as $ from "../../deps/scale.ts"
import { Chain } from "../ChainRune.ts"
import { ConstantChain } from "./ConstantChain.ts"

export type VersionedChain<C extends Chain> = ConstantChain<
  C,
  "System",
  "Version",
  { codec: $.Codec<Version> }
>

export interface Version {
  apis: [Uint8Array, number][]
  authoringVersion: number
  implName: string
  implVersion: number
  specName: string
  specVersion: number
  stateVersion: number
  transactionVersion: number
}
