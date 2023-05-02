import { getMetadataFromWsUrl, NetSpec } from "./NetSpec.ts"

export interface WsNetProps {
  url: string
  version?: string
}

export class WsNetSpec extends NetSpec {
  readonly url
  readonly version
  constructor(props: WsNetProps) {
    super()
    this.url = props.url
    this.version = props.version ?? "latest"
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
