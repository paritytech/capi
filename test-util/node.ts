import { fail } from "../_deps/asserts.ts";
import { blue } from "../_deps/colors.ts";
import { isPortAvailable } from "../util/mod.ts";

export interface TestNodeConfig {
  cwd?: string;
  altRuntime?: "kusama" | "rococo" | "westend";
}

export interface Node {
  config?: TestNodeConfig;
  inner: Deno.Process;
  close(): void;
  url: string;
}

let port = 9944;
export async function node(config?: TestNodeConfig): Promise<Node> {
  while (!isPortAvailable(port)) {
    port++;
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
    const logs = process.stderr.readable;
    await (async () => {
      console.log(blue(`Piping node logs:`));
      for await (const log of logs) {
        Deno.stdout.write(log);
        if (new TextDecoder().decode(log).includes(" Running JSON-RPC WS server")) {
          console.log(blue("Chain and RPC server initialized"));
          console.log(blue(`Suspending node logs`));
          return;
        }
      }
    })();
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
    fail();
  }
}
