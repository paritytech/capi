import { Connections } from "../common.ts";
import { WsConnection } from "./Connection.ts";

export class WsConnections implements Connections<string> {
  #connections: Record<string, WsConnection> = {};

  use = (url: string): WsConnection => {
    let connectionState: WsConnection | undefined = this.#connections[url];
    if (!connectionState) {
      connectionState = new WsConnection(url);
      this.#connections[url] = connectionState;
    }
    return connectionState;
  };
}
