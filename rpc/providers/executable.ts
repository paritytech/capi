import { AnyMethods } from "../../util/mod.ts";
import { Client, ClientProps } from "../Base.ts";
import {
  FailedToDisconnectError,
  FailedToOpenConnectionError,
  ProxyWsUrlClient,
  WebSocketInternalError,
} from "./ws.ts";

export interface ExecutableClientProps<
  M extends AnyMethods,
  DiscoveryValue,
  ParsedError extends Error,
> extends ClientProps<M, DiscoveryValue, ParsedError> {
  cmd: string[];
  cwd: string;
}

export class ExecutableClient<M extends AnyMethods>
  extends Client<M, string, MessageEvent, Event, WebSocketInternalError>
{
  process;
  inner;
  _send;
  parseError;
  parseIngressMessage;

  constructor(props: ExecutableClientProps<M, string, WebSocketInternalError>) {
    const process = Deno.run({
      cmd: props.cmd,
      cwd: props.cwd,
      stdin: "inherit",
      stderr: "inherit",
      stdout: "inherit",
    });
    super(props);
    this.process = process;
    this.inner = new ProxyWsUrlClient(props);
    this._send = this.inner._send;
    this.parseError = this.inner.parseError;
    this.parseIngressMessage = this.inner.parseIngressMessage;
  }

  static open = async <M extends AnyMethods>(
    props: ExecutableClientProps<M, string, WebSocketInternalError>,
  ): Promise<ProxyWsUrlClient<M> | FailedToOpenConnectionError> => {
    return new ExecutableClient(props);
  };

  close = async (): Promise<undefined | FailedToDisconnectError> => {
    this.process.close();
    return this.inner.close();
  };
}
