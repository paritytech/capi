import { metadata } from "./Metadata.ts";
import { rpcClient } from "./RpcClient.ts";

export type CapiAtom = ReturnType<metadata | rpcClient>;

export * from "./Metadata.ts";
export * from "./RpcClient.ts";
