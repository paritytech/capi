import { InitBase, NotifBase, ResBase } from "../common.ts";

export type AuthorSubmitAndWatchExtrinsicInit = InitBase<"author_submitAndWatchExtrinsic", [tx: string]>;

export type AuthorSubmitAndWatchExtrinsicRes = ResBase<string>;

export type AuthorSubmitAndWatchExtrinsicNotif = NotifBase<"author_submitAndWatchExtrinsic", unknown>;
