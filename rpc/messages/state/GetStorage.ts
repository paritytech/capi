import { InitBase, ResBase } from "../common.ts";

export type StateGetStorageInit = InitBase<"state_getStorage", [
  key: string,
  blockHash?: string,
]>;

export type StateGetStorageRes = ResBase<string>;
