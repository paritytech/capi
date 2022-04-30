import { InitBase, ResBase } from "../common.ts";

export type StateGetMetadataInit = InitBase<"state_getMetadata", [blockHash?: string]>;

export type StateGetMetadataRes = ResBase<string>;
