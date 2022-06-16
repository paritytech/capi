// TODO: brands
// TODO: deal with error results binding to throw behavior (instead of return)

import { instantiate } from "./mod.generated.js";
import { Ss58Registry } from "./registry.ts";

export type DecodeSs58TextError = "Base58ConversionFailed" | "InvalidLen" | "InvalidChecksum";
export type DecodeSs58Text = (
  text: string,
) => [Ss58Registry["prefix"], string];

export type EncodeSs58TextError = "";
export type EncodeSs58Text = (prefix: Ss58Registry["prefix"], pubKey: string) => string;

export interface Ss58Util {
  decodeSs58Text: DecodeSs58Text;
  encodeSs58Text: EncodeSs58Text;
}

export async function Ss58Util(): Promise<Ss58Util> {
  const instance = await instantiate();
  return {
    decodeSs58Text: instance.decodeSs58Text as DecodeSs58Text,
    encodeSs58Text: instance.encodeSs58Text as EncodeSs58Text,
  };
}
