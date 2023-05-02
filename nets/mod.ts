import { DevNetProps } from "./DevNetSpec.ts"
import { DevRelaySpec } from "./DevRelaySpec.ts"
import { MetadataNetProps, MetadataNetSpec } from "./MetadataNetSpec.ts"
import { WsNetProps, WsNetSpec } from "./WsNetSpec.ts"

export namespace net {
  export function dev(props: DevNetProps) {
    return new DevRelaySpec(props)
  }
  export function ws(props: WsNetProps) {
    return new WsNetSpec(props)
  }
  export function metadata(props: MetadataNetProps) {
    return new MetadataNetSpec(props)
  }
}

// moderate

export * from "./bins.ts"
export * from "./chain_spec/mod.ts"
export * from "./DevNetSpec.ts"
export * from "./DevParachainSpec.ts"
export * from "./DevRelaySpec.ts"
export * from "./MetadataNetSpec.ts"
export * from "./NetSpec.ts"
export * from "./WsNetSpec.ts"
