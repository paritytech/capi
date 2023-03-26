import { FrameMetadata } from "../../frame_metadata/FrameMetadata.ts"
import { Chain } from "../ChainRune.ts"

export type ConstantChain<
  C extends Chain,
  P extends string,
  K extends string,
  V extends Partial<FrameMetadata.Constant>,
> = ConstantConstraint<P, K, V> extends C ? never : C

interface ConstantConstraint<
  P extends string,
  N extends string,
  C extends Partial<FrameMetadata.Constant>,
> {
  metadata: {
    pallets: Record<P, {
      constants: Record<N, C>
    }>
  }
}
