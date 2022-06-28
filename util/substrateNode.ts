import { deadline } from "../_deps/async.ts";
import { blue } from "../_deps/colors.ts";
import * as path from "../_deps/path.ts";
import { ErrorCtor } from "./ErrorCtor.ts";

export interface SubstrateNodeConfig {
  cwd?: string;
  port?: number;
  dev?: true;
  path: string;
  timeout?: number;
}

export interface SubstrateNode {
  config: SubstrateNodeConfig;
  inner: Deno.Process;
  close(): void;
  url: string;
}

export async function substrateNode(config: SubstrateNodeConfig): Promise<
  SubstrateNode | Deno.errors.NotFound | FailedToExeError
> {
  let cwd: string;
  const cmd: string[] = [];
  const pathAbs = path.join(config.cwd || Deno.cwd(), config.path);
  let isProject: boolean;
  try {
    const stat = await Deno.stat(pathAbs);
    if (stat.isDirectory) {
      try {
        await Deno.stat(path.join(pathAbs, "Cargo.toml"));
        isProject = stat.isDirectory;
      } catch (_e) {
        return new FailedToExeError();
      }
    } else {
      isProject = false;
    }
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return e;
    }
    return new FailedToExeError();
  }
  if (isProject) {
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
  // For some reason, logs come in through `stderr`
  const logs = process.stderr.readable;
  const spawning = (async () => {
    console.log(blue(`Piping logs from ${isProject ? "project" : "bin"} run:`));
    for await (const log of logs) {
      Deno.stdout.write(log);
      if (new TextDecoder().decode(log).includes(" Running JSON-RPC WS server")) {
        console.log(blue("Chain and RPC server initialized"));
        console.log(blue(`Suspending the logs of ${isProject ? "project" : "bin"} run`));
        return;
      }
    }
  })();
  try {
    await (config.timeout ? deadline(spawning, config.timeout) : spawning);
  } catch (_e) {
    return new FailedToExeError();
  }
  return {
    config,
    inner: process,
    close: () => {
      process.close();
    },
    url: `ws://127.0.0.1:${config.port || 9944}`,
  };
}

export class FailedToExeError extends ErrorCtor("FailedToExe") {}
