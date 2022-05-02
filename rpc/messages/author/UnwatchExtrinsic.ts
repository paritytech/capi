import { InitBase, ResBase } from "../common.ts";

export type AuthorUnwatchExtrinsicInit = InitBase<"author_unwatchExtrinsic", [subscription: string]>;

export type AuthorUnwatchExtrinsicRes = ResBase<unknown>;
