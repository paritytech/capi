import { Decoded } from "./Decoded.ts";
import { DeriveCodec } from "./DeriveCodec.ts";
import { EntryMetadata, Metadata, PalletMetadata } from "./Metadata.ts";
import { RpcCall } from "./RpcCall.ts";
import { RpcClient } from "./RpcClient.ts";
import { Select } from "./Select.ts";
import { StorageKey } from "./StorageKey.ts";
import { Wrap } from "./Wrap.ts";

export type CapiAtom =
  | Metadata
  | EntryMetadata
  | PalletMetadata
  | RpcClient
  | DeriveCodec
  | StorageKey
  | RpcCall
  | Select
  | Decoded
  | Wrap;

export * from "./Decoded.ts";
export * from "./DeriveCodec.ts";
export * from "./Metadata.ts";
export * from "./RpcCall.ts";
export * from "./RpcClient.ts";
export * from "./Select.ts";
export * from "./StorageKey.ts";
export * from "./Wrap.ts";
