import { Config as Config_ } from "../config/mod.ts";
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
  let port;
  if (props?.port) {
    if (!isPortAvailable(props.port)) {
      fail(`Port ${props.port} is unavailable`);
    }
    port = props.port;
  } else {
    port = getRandomPort();
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
      stdout: "null",
      stderr: "null",
    });

    await waitForPort({ port });

    return new Config(
      port,
      () => {
        process.kill("SIGKILL");
        process.close();
      },
      props?.altRuntime,
    );
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

function getRandomPort(min = 49152, max = 65534): number {
  let randomPort;

  do {
    randomPort = Math.floor(Math.random() * (max - min + 1) + min);
  } while (!isPortAvailable(randomPort));

  return randomPort;
}

interface WaitForPortOptions {
  attempts: number;
  delayBetweenAttempts: number;
}

async function waitForPort(
  connectOptions: Deno.ConnectOptions,
  options?: WaitForPortOptions,
): Promise<void> {
  let attempts = options?.attempts ?? 20;
  const delayBetweenAttempts = options?.delayBetweenAttempts ?? 500;

  while (attempts > 0) {
    attempts--;

    try {
      const connection = await Deno.connect(connectOptions);
      connection.close();

      break;
    } catch (error) {
      if (
        error instanceof Deno.errors.ConnectionRefused
        && attempts > 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
        continue;
      }

      throw error;
    }
  }
}
