import { WsConnection } from "../rpc/mod.ts"

export class DevnetConnection extends WsConnection {
  constructor(path: string) {
    const server = Deno.env.get("DEVNETS_SERVER")
    if (!server) throw new Error("Must be run with a devnets server")
    const url = new URL(path, server)
    url.protocol = "ws"
    super(url.toString())
  }
}
