import { InitBase, ResBase } from "../common.ts";

export type AuthorHasKeyInit = InitBase<"author_hasKey", [
  pubKey: string,
  // TODO: narrow
  keyType: string,
]>;

export type AuthorHasKeyRes = ResBase<string>;
