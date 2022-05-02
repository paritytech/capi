import { InitBase, ResBase } from "../common.ts";

export type AuthorPendingExtrinsicsInit = InitBase<"author_pendingExtrinsics", [string]>;

export type AuthorPendingExtrinsicsRes = ResBase<string[]>;
