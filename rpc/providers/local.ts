import { deadline } from "../../_deps/async.ts";
import { blue } from "../../_deps/colors.ts";
import * as path from "../../_deps/path.ts";
import { AnyMethods, ErrorCtor } from "../../util/mod.ts";
import { ClientHooks } from "../Base.ts";
import {
  createWsClient,
  FailedToOpenConnectionError,
  ProxyWsUrlClient,
  WebSocketInternalError,
} from "./ws.ts";

export interface LocalClientProps<M extends AnyMethods> {
  cwd?: string;
  port?: number;
  hooks?: ClientHooks<M, WebSocketInternalError> & {
    useProcess?: (process: Deno.Process) => void;
  };
  dev?: true;
  path: string;
  timeout?: number;
}

export async function localClient<M extends AnyMethods>(props: LocalClientProps<M>): Promise<
  ProxyWsUrlClient<M> | FailedToOpenConnectionError | FailedToExeError | Deno.errors.NotFound
> {
  let cwd: string;
  const cmd: string[] = [];
  const pathAbs = path.join(props.cwd || Deno.cwd(), props.path);
  try {
    const stat = await Deno.stat(pathAbs);
    if (stat.isDirectory) {
      cwd = pathAbs;
      cmd.push("cargo", "run", "--");
    } else {
      cwd = props.cwd || Deno.cwd();
      cmd.push(props.path);
    }
    if (props.dev) {
      cmd.push("--dev");
    }
    if (props.port) {
      cmd.push("--ws-port", props.port.toString());
    }
    const process = Deno.run({
      cmd,
      cwd,
      stderr: "piped",
      stdout: "piped",
    });
    props.hooks?.useProcess?.(process);
    // For some reason, logs come in through `stderr`
    const logs = process.stderr.readable;
    const spawning = (async () => {
      console.log(blue(`Piping logs from ${stat.isDirectory ? "project" : "bin"} run:`));
      for await (const log of logs) {
        Deno.stdout.write(log);
        if (new TextDecoder().decode(log).includes(" Running JSON-RPC WS server")) {
          console.log(blue("Chain and RPC server initialized"));
          console.log(blue(`Suspending the logs of ${stat.isDirectory ? "project" : "bin"} run`));
          return;
        }
      }
    })();
    try {
      await (props.timeout ? deadline(spawning, props.timeout) : spawning);
    } catch (_e) {
      return new FailedToExeError();
    }
    const client = await createWsClient(`ws://127.0.0.1:${props.port || 9944}`, {
      ...props.hooks || {},
      close() {
        props.hooks?.close?.();
        process.close();
      },
    });
    if (client instanceof Error) {
      return client;
    }
    console.log(blue("Client connection established"));
    return client;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return e;
    }
    return new FailedToExeError();
  }
}

export class FailedToExeError extends ErrorCtor("FailedToExe") {}
