import { InitBase, ResBase } from "../common.ts";

export type AuthorSubmitExtrinsicInit = InitBase<"author_submitExtrinsic", [tx: string]>;

export type AuthorSubmitExtrinsicRes = ResBase<string>;
