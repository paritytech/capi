import { WsConnection } from "../../rpc/mod.ts"
import { detectServer } from "./detectServer.ts"

export class DevnetConnection extends WsConnection {
  constructor(path: string) {
    const url = new URL(`/devnets/${path}`, detectServer())
    url.protocol = "ws"
    super(url.toString())
  }
}
