import { Config as Config_ } from "../config/mod.ts";
import { blue } from "../deps/std/fmt/colors.ts";
import { fail } from "../deps/std/testing/asserts.ts";
import { rpc, TmpMetadata } from "../known/mod.ts";

export interface NodeProps {
  altRuntime?: "kusama" | "rococo" | "westend";
  port?: number;
}

export class Config
  extends Config_<string, rpc.CallMethods, rpc.SubscriptionMethods, rpc.ErrorDetails, TmpMetadata>
{
  constructor(
    port: number,
    readonly close: () => void,
    altRuntime?: NodeProps["altRuntime"],
  ) {
    super(
      `ws://127.0.0.1:${port}`,
      altRuntime
        ? {
          kusama: 2,
          rococo: undefined!, /* TODO */
          westend: 0,
        }[altRuntime]
        : 0,
    );
  }
}

export async function config(props?: NodeProps): Promise<Config> {
  if ("_browserShim" in Deno) return new Config(9944, () => {});
  let port = 9944;
  if (props?.port) {
    if (!isPortAvailable(props.port)) {
      fail(`Port ${props.port} is unavailable`);
    }
    port = props.port;
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
        ...props?.altRuntime ? [`--force-${props.altRuntime}`] : [],
      ],
      stderr: "piped",
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

    return new Config(port, process.close.bind(process), props?.altRuntime);
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
