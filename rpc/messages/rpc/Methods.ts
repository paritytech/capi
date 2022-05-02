import { InitBase, ResBase } from "../common.ts";

export type RpcMethodsInit = InitBase<"rpc_methods", []>;

// TODO: narrow `string`
export type RpcMethodsRes = ResBase<string[]>;
