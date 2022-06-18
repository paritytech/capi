// TODO: brands
// TODO: narrow error typings
import { instantiate } from "./mod.generated.mjs";

// TODO: `encodeBuf` and `decodeBuf`, if useful.
export interface Ss58 {
  encode(prefix: number, pubKey: string): string;
  decode(text: string): [number, string];
}

export async function Ss58(): Promise<Ss58> {
  const instance = await instantiate();
  return {
    encode: instance.encode,
    decode: instance.decode as Ss58["decode"],
  };
}
