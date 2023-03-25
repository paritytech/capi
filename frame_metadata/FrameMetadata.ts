import * as $ from "../deps/scale.ts"

export interface FrameMetadata {
  types: Record<string, $.AnyCodec>
  pallets: Record<string, FrameMetadata.Pallet>
  extrinsic: FrameMetadata.Extrinsic
}
export namespace FrameMetadata {
  export interface Pallet {
    id: number
    name: string
    storagePrefix: string
    storage: Record<string, StorageEntry>
    constants: Record<string, Constant>
    types: {
      call?: $.AnyCodec
      event?: $.AnyCodec
      error?: $.AnyCodec
    }
    docs: string
  }

  export interface StorageEntry {
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
