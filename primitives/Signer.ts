import { MultiSignature } from "./MultiSignature.ts"

export type Signer =
  | ((message: Uint8Array) => MultiSignature | Promise<MultiSignature>)
  | PolkadotSigner

export interface PolkadotSigner {
  signPayload(payload: any): Promise<{ signature: string }>
}
