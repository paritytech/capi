import { NetSpec } from "./NetSpec.ts"

export interface MetadataNetProps {
  metadata: Uint8Array
}

export function metadata(props: MetadataNetProps) {
  return new MetadataNetSpec(props)
}

export class MetadataNetSpec extends NetSpec {
  _metadata
  constructor(props: MetadataNetProps) {
    super()
    this._metadata = props.metadata
  }

  connection() {
    return undefined
  }

  async metadata() {
    return this._metadata
  }
}
