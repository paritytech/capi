// TODO: brands
// TODO: narrow error typings
import { decompress } from "../../_deps/lz4.ts";
import { instantiate } from "./mod.generated.mjs";

// TODO: `encodeBuf` and `decodeBuf`, if useful.
export interface Ss58 {
  encode(prefix: number, pubKey: string): string;
  decode(text: string): [number, string];
}

export async function Ss58(): Promise<Ss58> {
  const instance = await instantiate(decompress);
  return {
    encode: instance.encode,
    decode: instance.decode as Ss58["decode"],
  };
}
