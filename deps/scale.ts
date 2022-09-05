import { Encoded } from "../util/branded.ts";

export * from "https://deno.land/x/scale@v0.6.1/mod.ts";
declare module "https://deno.land/x/scale@v0.6.1/common.ts" {
  export interface Codec<T> {
    encodeA(value: T): Encoded<T>;
    decodeA(array: Encoded<T>): T;
  }
}
