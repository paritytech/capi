import { FrameMetadata } from "../../frame_metadata/FrameMetadata.ts"
import { Chain } from "../ChainRune.ts"

export interface ConstantConstraint<
  P extends string = string,
  N extends string = string,
  C extends Partial<FrameMetadata.Constant> = Partial<FrameMetadata.Constant>,
> {
  metadata: {
    pallets: Record<P, {
      constants: Record<N, C>
    }>
  }
}

export type ConstantChain<
  C extends Chain,
  P extends string,
  K extends string,
  V extends Partial<FrameMetadata.Constant>,
> = C extends ConstantConstraint<P, K, V> ? C : never
