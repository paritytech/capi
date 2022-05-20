export interface DecodeSs58Runtime {
  decodeSs58: (ss58Text: string) => Uint8Array;
}

export class DecodeSs58RuntimeError extends Error {}
