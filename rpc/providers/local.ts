import { deadline } from "../../_deps/async.ts";
import { blue } from "../../_deps/colors.ts";
import * as path from "../../_deps/path.ts";
import { Beacon } from "../../Beacon.ts";
import { AnyMethods, ErrorCtor } from "../../util/mod.ts";
import { ClientHooks } from "../Base.ts";
import {
  FailedToOpenConnectionError,
  ProxyBeacon,
  ProxyClient,
  proxyClient,
  WebSocketInternalError,
} from "./proxy.ts";

export interface LocalClientProps {
  cwd?: string;
  port?: number;
  dev?: true;
  path: string;
  timeout?: number;
}

export class LocalBeacon<M extends AnyMethods> extends Beacon<LocalClientProps, M> {}

export interface LocalClientHooks<M extends AnyMethods>
  extends ClientHooks<M, WebSocketInternalError>
{
  process?: (process: Deno.Process) => void;
}

export async function localClient<M extends AnyMethods>(
  beacon: LocalBeacon<M>,
  hooks?: LocalClientHooks<M>,
): Promise<
  | ProxyClient<M>
  | FailedToOpenConnectionError
  | FailedToExeError
  | Deno.errors.NotFound
> {
  let cwd: string;
  const cmd: string[] = [];
  const config = beacon.discoveryValue;
  const pathAbs = path.join(config.cwd || Deno.cwd(), config.path);
  try {
    const stat = await Deno.stat(pathAbs);
    if (stat.isDirectory) {
      cwd = pathAbs;
      cmd.push("cargo", "run", "--");
    } else {
      cwd = config.cwd || Deno.cwd();
      cmd.push(config.path);
    }
    if (config.dev) {
      cmd.push("--dev");
    }
    if (config.port) {
      cmd.push("--ws-port", config.port.toString());
    }
    const process = Deno.run({
      cmd,
      cwd,
      stderr: "piped",
      stdout: "piped",
    });
    hooks?.process?.(process);
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
      await (config.timeout ? deadline(spawning, config.timeout) : spawning);
    } catch (_e) {
      return new FailedToExeError();
    }
    const beacon = new ProxyBeacon<M>(`ws://127.0.0.1:${config.port || 9944}`);
    const client = await proxyClient(beacon, {
      ...hooks || {},
      close() {
        hooks?.close?.();
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
