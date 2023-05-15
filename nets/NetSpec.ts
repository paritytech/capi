import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { WsConnection } from "../rpc/mod.ts"
import { withSignal } from "../util/mod.ts"

export interface NetProps {
  targets?: Record<string, NetSpec>
}

export abstract class NetSpec implements NetProps {
  name!: string // set by `resolveNets.ts`
  targets

  abstract connection(name: string): ConnectionSpec
  abstract metadata(signal: AbortSignal, tempDir: string): Promise<Uint8Array>

  constructor({ targets }: NetProps) {
    this.targets = targets
  }
}

export function getMetadataFromWsUrl(url: string) {
  return withSignal(async (signal) => {
    const connection = WsConnection.connect(url, signal)
    const response = await connection.call("state_getMetadata", [])
    if (response.error) throw new Error("Error getting metadata")
    return hex.decode(response.result as string)
  })
}

export type ConnectionSpec = $.Native<typeof $connectionSpec>
export const $connectionSpec = $.taggedUnion("type", [
  $.variant("WsConnection", $.field("discovery", $.str)),
  $.variant("DevnetConnection", $.field("discovery", $.str)),
])
