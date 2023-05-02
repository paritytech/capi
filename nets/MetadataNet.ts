import { Net } from "./Net.ts"

export function metadata(metadata: Uint8Array) {
  return new MetadataNet(metadata)
}

export class MetadataNet extends Net {
  constructor(readonly _metadata: Uint8Array) {
    super()
  }

  connection() {
    return undefined
  }

  async metadata() {
    return this._metadata
  }
}
