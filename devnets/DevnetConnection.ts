import { WsConnection } from "../rpc/mod.ts"
import { devnetsUrl } from "./devnets_env.ts"

export class DevnetConnection extends WsConnection {
  constructor(path: string) {
    const url = new URL(path, devnetsUrl())
    url.protocol = "ws"
    super(url.toString())
  }
}
