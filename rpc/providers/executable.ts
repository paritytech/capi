import { readLines } from "https://deno.land/std@0.144.0/io/mod.ts";
import { writeAll } from "https://deno.land/std@0.144.0/streams/conversion.ts";
import { assert } from "../../_deps/asserts.ts";
import { deadline, deferred } from "../../_deps/async.ts";
import { AnyMethods } from "../../util/mod.ts";
import { ClientHooks } from "../Base.ts";
import { FailedToOpenConnectionError, ProxyWsUrlClient, WebSocketInternalError } from "./ws.ts";

export interface ExecutableClientProps<
  M extends AnyMethods,
  ParsedError extends Error,
> {
  bin: string;
  cwd?: string;
  port: number;
  hooks?: ClientHooks<M, ParsedError> & {
    useProcess(process: ReturnType<typeof run>): void;
  };
}

async function pipeThrough(
  prefix: string,
  reader: Deno.Reader,
  writer: Deno.Writer,
) {
  const encoder = new TextEncoder();
  for await (const line of readLines(reader)) {
    await writeAll(writer, encoder.encode(`[${prefix}] ${line}\n`));
  }
}

export async function executableClient<M extends AnyMethods>(
  props: ExecutableClientProps<M, WebSocketInternalError>,
): Promise<ProxyWsUrlClient<M> | FailedToOpenConnectionError> {
  // const serverReady = deferred();
  const process = run(props);
  props.hooks?.useProcess?.(process);
  const logs = process.stderr.readable;
  const spawning = (async () => {
    for await (const log of logs) {
      if (new TextDecoder().decode(log).includes(" Running JSON-RPC WS server")) {
        return;
      }
    }
  })();
  try {
    await deadline(spawning, 1000);
  } catch (_e) {
    // TODO: new error?
    return new FailedToOpenConnectionError();
  }
  return ProxyWsUrlClient.open({
    discoveryValue: `ws://localhost:${props.port}`,
    hooks: {
      ...props.hooks || {},
      close() {
        props.hooks?.close?.();
        process.close();
      },
    },
  });
}

function run<
  M extends AnyMethods,
  ParsedError extends Error,
>(props: ExecutableClientProps<M, ParsedError>) {
  return Deno.run({
    cmd: [props.bin, "--dev", "--ws-port", props.port.toString()],
    cwd: props.cwd,
    stderr: "piped",
    stdout: "piped",
  });
}
