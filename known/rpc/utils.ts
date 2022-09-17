import { Expand } from "../../deps/scale.ts";
import * as U from "../../util/mod.ts";

export type SerdeResult<O, E> = SerdeEnum<{ Ok: O; Err: E }>;
export type SerdeEnum<T> = {
  [K in keyof T]: T[K] extends void ? K : Expand<Pick<T, K> & Omit<{ [K in keyof T]?: never }, K>>;
}[keyof T];

export type Hex = U.Hex;
export type Hash = U.HexHash;
export type SubId = string;
export type AccountId = string;
export type Subscription<T, U> = null;
export type NumberOrHex = U.HexEncoded<bigint> | number;
export type ListOrValue<T> = T | T[];
export type Result<T> = T;
