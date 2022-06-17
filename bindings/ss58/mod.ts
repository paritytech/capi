// TODO: brands
import { ReasonBearingErrorCtor } from "../../util/mod.ts";
import { normalizeErrors } from "../common.ts";
import { instantiate } from "./mod.generated.js";

// TODO: `encodeBuf` and `decodeBuf`, if useful.
export interface Ss58 {
  encode(prefix: number, pubKey: string): string | Ss58EncodeError;
  decode(text: string): [number, string] | Ss58DecodeError;
}

export async function Ss58(): Promise<Ss58> {
  const instance = await instantiate();
  return {
    encode: normalizeErrors(instance.encode, Ss58EncodeError),
    decode: normalizeErrors(instance.decode, Ss58DecodeError),
  };
}

export class Ss58EncodeError
  extends ReasonBearingErrorCtor("Ss58EncodeError")<"HexDecodingFailed" | "InvalidPubKeyLen">()
{}
export class Ss58DecodeError extends ReasonBearingErrorCtor("Ss58DecodeError")<
  "Base58DecodingFailed" | "InvalidLen" | "InvalidChecksum"
>() {}
