import { FrameMetadata } from "../../frame_metadata/FrameMetadata.ts"
import { Chain } from "../ChainRune.ts"

export type StorageChain<
  C extends Chain,
  P extends string,
  K extends string,
  V extends Partial<FrameMetadata.StorageEntry>,
> = C extends StorageConstraint<P, K, V> ? C : never

interface StorageConstraint<
  P extends string = string,
  N extends string = string,
  S extends Partial<FrameMetadata.StorageEntry> = Partial<FrameMetadata.StorageEntry>,
> {
  metadata: {
    pallets: Record<P, {
      storage: Record<N, S>
    }>
  }
}
