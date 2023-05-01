import { Net } from "./Net.ts"

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
