import { deadline } from "../_deps/async.ts";
import { blue } from "../_deps/colors.ts";
import * as path from "../_deps/path.ts";
import { ErrorCtor } from "./ErrorCtor.ts";
import { exists } from "./fs.ts";
import { repo } from "./repo.ts";

export type SubstrateNodeConfig =
  & {
    prod?: true;
    timeout?: number;
    cwd?: string;
    port?: number;
  }
  & ({
    repo: string;
    branch?: string;
    cloneDir: string;
    ensureSynced?: false;
    recompile?: false;
    project?: never;
    bin?: never;
  } | {
    repo?: never;
    branch?: never;
    cloneDir: never;
    ensureSynced?: never;
    recompile?: false;
    project: string;
    bin?: never;
  } | {
    repo?: never;
    branch?: never;
    cloneDir: never;
    ensureSynced?: never;
    recompile?: never;
    project?: never;
    bin: string;
  });

export interface SubstrateNode {
  config: SubstrateNodeConfig;
  inner: Deno.Process;
  close(): void;
  url: string;
}

export async function substrateNode(config: SubstrateNodeConfig) {
  let project = config.project;
  if (config.repo) {
    const result = await repo(config);
    if (result instanceof Error) {
      return result;
    }
    project = result;
  }
  if (config.project) {
    project = path.join(config.cwd || Deno.cwd(), config.project);
    try {
      const stat = await Deno.stat(project);
      if (stat.isDirectory) {
        if (!(await exists(path.join(project, "Cargo.toml")))) {
          return new FailedToExeError();
        }
      }
      return new FailedToExeError();
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return e;
      }
      return new FailedToExeError();
    }
  }
  const cmd: string[] = [];
  let cwd: string;
  if (project) {
    cwd = project;
    if (config.recompile === false && await exists(path.join(cwd, DEBUG_BIN_PATH))) {
      cmd.push(DEBUG_BIN_PATH);
    } else {
      cmd.push("cargo", "run", "--");
    }
  } else {
    cwd = config.cwd || Deno.cwd();
    if (config.bin) {
      cmd.push(config.bin);
    }
  }
  if (!config.prod) {
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
    console.log(blue("Piping logs from node"));
    for await (const log of logs) {
      Deno.stdout.write(log);
      if (new TextDecoder().decode(log).includes(" Running JSON-RPC WS server")) {
        console.log(blue("Chain and RPC server initialized"));
        console.log(blue("Suspending node logs of node"));
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

const DEBUG_BIN_PATH = "./target/debug/node-template";
