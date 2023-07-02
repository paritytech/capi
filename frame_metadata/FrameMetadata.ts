import * as $ from "../deps/scale.ts"
import { RuntimeEventValue } from "./Event.ts"

export interface FrameMetadata {
  types: Record<string, $.AnyCodec>
  paths: Record<string, $.AnyCodec>
  pallets: Record<string, FrameMetadata.Pallet>
  extrinsic: FrameMetadata.Extrinsic
}
export namespace FrameMetadata {
  export interface Pallet {
    id: number
    name: string
    storagePrefix: string
    storage: Record<string, StorageEntries>
    constants: Record<string, Constant>
    types: {
      call?: $.AnyCodec
      event?: $.Codec<never, RuntimeEventValue>
      error?: $.AnyCodec
    }
    docs: string
  }

  export interface StorageEntries {
    singular: boolean
    name: string
    key: $.AnyCodec
    partialKey: $.AnyCodec
    value: $.AnyCodec
    default?: Uint8Array
    docs: string
  }

  export interface Constant {
    name: string
    codec: $.AnyCodec
    value: Uint8Array
    docs: string
  }

  export interface Extrinsic {
    call: $.AnyCodec
    signature: $.AnyCodec
    address: $.AnyCodec
    extra: $.AnyCodec
    additional: $.AnyCodec
  }
}
