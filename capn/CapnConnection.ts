import { WsConnection } from "../rpc/mod.ts"

export class CapnConnection extends WsConnection {
  constructor(path: string) {
    const server = Deno.env.get("CAPN_SERVER")
    if (!server) throw new Error("Must be run with a capn server")
    const url = new URL(path, server)
    url.protocol = "ws"
    super(url.toString())
  }
}
