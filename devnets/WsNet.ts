import { getMetadataFromWsUrl, Net } from "./Net.ts"

export class WsNet extends Net {
  constructor(readonly url: string, readonly version = "latest") {
    super()
  }

  connection() {
    return {
      type: "WsConnection" as const,
      discovery: this.url,
    }
  }

  _metadata?: Promise<Uint8Array>
  metadata() {
    if (!this._metadata) this._metadata = getMetadataFromWsUrl(this.url)
    return this._metadata
  }
}
