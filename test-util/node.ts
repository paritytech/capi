import { blue } from "../deps/std/fmt/colors.ts";
import { fail } from "../deps/std/testing/asserts.ts";

export interface NodeConfig {
  cwd?: string;
  altRuntime?: "kusama" | "rococo" | "westend";
  port?: number;
}

export interface Node {
  config?: NodeConfig;
  inner: Deno.Process;
  close(): void;
  url: string;
}

export async function node(config?: NodeConfig): Promise<Node> {
  let port = 9944;
  if (config?.port) {
    if (!isPortAvailable(config.port)) {
      fail(`Port ${config.port} is unavailable`);
    }
    port = config.port;
  } else {
    while (!isPortAvailable(port)) {
      port++;
    }
  }
  try {
    const process = Deno.run({
      cmd: [
        "polkadot",
        "--dev",
        "--ws-port",
        port.toString(),
        ...config?.altRuntime ? [`--force-${config.altRuntime}`] : [],
      ],
      cwd: config?.cwd,
      stderr: "piped",
      stdout: "piped",
    });
    // For some reason, logs come in through `stderr`
    console.log(blue(`Piping node logs:`));
    for await (const log of process.stderr.readable) {
      await Deno.stdout.write(log);
      if (new TextDecoder().decode(log).includes(" Running JSON-RPC WS server")) {
        console.log(blue("Chain and RPC server initialized"));
        console.log(blue(`Suspending node logs`));
        break;
      }
    }
    return {
      config,
      inner: process,
      close: () => {
        process.close();
      },
      url: `ws://127.0.0.1:${port}`,
    };
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      fail("Must have Polkadot installed locally. Visit https://github.com/paritytech/polkadot.");
    }
    throw e; // TODO: don't go nuclear without proper messaging
  }
}

function isPortAvailable(port: number): boolean {
  try {
    const listener = Deno.listen({
      transport: "tcp",
      hostname: "127.0.0.1",
      port,
    });
    listener.close();
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.AddrInUse) {
      return false;
    }
    throw error;
  }
}
