import { deriveCodec } from "./DeriveCodec.ts";
import { metadata } from "./Metadata.ts";
import { rpcClient } from "./RpcClient.ts";
import { storageKey } from "./StorageKey.ts";

export type CapiAtom = ReturnType<
  | metadata
  | rpcClient
  | deriveCodec
  | storageKey
>;

export * from "./DeriveCodec.ts";
export * from "./Metadata.ts";
export * from "./RpcClient.ts";
export * from "./StorageKey.ts";
