import * as $ from "../../deps/scale.ts"
import { Chain } from "../ChainRune.ts"
import { ConstantChain } from "./ConstantChain.ts"

export type Ss58Chain<C extends Chain> = ConstantChain<
  C,
  "System",
  "Ss58Prefix",
  { codec: $.Codec<number> }
>
