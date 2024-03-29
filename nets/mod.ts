import { DevNetProps } from "./DevNetSpec.ts"
import { DevRelaySpec } from "./DevRelaySpec.ts"
import { WsNetProps, WsNetSpec } from "./WsNetSpec.ts"

export namespace net {
  export function dev(props: DevNetProps) {
    return new DevRelaySpec(props)
  }
  export function ws(props: WsNetProps) {
    return new WsNetSpec(props)
  }
}

// moderate

export * from "./bins.ts"
export * from "./chain_spec/mod.ts"
export * from "./DevNetSpec.ts"
export * from "./DevParachainSpec.ts"
export * from "./DevRelaySpec.ts"
export * from "./NetSpec.ts"
export * from "./WsNetSpec.ts"
