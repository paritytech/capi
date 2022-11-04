import { upperFirstCase } from "../deps/case.ts";
import * as colors from "../deps/std/fmt/colors.ts";
import * as Z from "../deps/zones.ts";
import * as C from "../mod.ts";

class LocalClient extends C.rpc.Client<string, Event, Event, Event> {
  constructor(url: string, readonly close: () => void) {
    super(C.rpc.proxyProvider, url);
    // TODO: why isn't creating an override `discard` and delegating to `super` isn't doing the trick?
    const prev = this.discard;
    this.discard = async () => {
      const closeError = await prev();
      this.close();
      return closeError;
    };
  }
}

const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
const portRaw = Deno.env.get("TEST_CTX_PORT");

export function localClient(runtime: RuntimeName): Z.Effect<LocalClient, never, never> & {
  url: Promise<string>;
  client: Promise<LocalClient>;
} {
  let close = () => {};
  let urlPending: undefined | Promise<string>;
  const url = (): Promise<string> => {
    if (!urlPending) {
      console.log(
        colors.blue(
          `${colors.bold("Creating")} a ${upperFirstCase(runtime)}-like development chain`,
        ),
      );
      urlPending = (async () => {
        let port: number;
        if (!portRaw) {
          port = getOpenPort();
          const p = spawnDevNetProcess(port, runtime);
          close = () => {
            p.kill("SIGKILL");
            p.close();
          };
          await portReady(port);
        } else {
          const conn = await Deno.connect({
            hostname,
            port: parseInt(portRaw!),
          });
          conn.write(new Uint8Array([RUNTIME_CODES[runtime]]));
          port = await (async () => {
            for await (const x of conn.readable) {
              return new DataView(x.buffer).getUint16(0);
            }
            return undefined!;
          })();
        }
        return `ws://127.0.0.1:${port}`;
      })();
    }
    return urlPending;
  };
  const clientFac = async () => {
    return new LocalClient(await url(), () => {
      console.log(colors.blue(`${colors.bold("Destroying")} development chain`));
      close();
    });
  };
  return {
    ...Z.call(0, clientFac),
    get url() {
      return url();
    },
    get client() {
      return clientFac();
    },
  };
}

export type RuntimeCode = typeof RUNTIME_CODES;
export const RUNTIME_CODES = {
  polkadot: 0,
  kusama: 1,
  westend: 2,
  rococo: 3,
} as const;
export type RuntimeName = keyof RuntimeCode;
export const RUNTIME_NAMES: { [N in RuntimeName as RuntimeCode[N]]: N } = {
  0: "polkadot",
  1: "kusama",
  2: "westend",
  3: "rococo",
};

export async function portReady(port: number): Promise<void> {
  let attempts = 60;
  while (--attempts) {
    try {
      const connection = await Deno.connect({ port });
      connection.close();
      break;
    } catch (e) {
      if (e instanceof Deno.errors.ConnectionRefused && attempts > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        throw new Error();
      }
    }
  }
}

export function getOpenPort(): number {
  const tmp = Deno.listen({ port: 0 });
  const { port } = (tmp.addr as Deno.NetAddr);
  tmp.close();
  return port;
}

export function spawnDevNetProcess(port: number, runtimeName: RuntimeName) {
  const cmd = ["polkadot", "--dev", "--ws-port", port.toString()];
  if (runtimeName !== "polkadot") {
    cmd.push(`--force-${runtimeName}`);
  }
  try {
    // TODO: decide which specific logs to pipe to this file's process
    return Deno.run({
      cmd,
      stdout: "piped",
      stderr: "piped",
    });
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      throw new Error(
        `Must have Polkadot installed locally. Visit "https://github.com/paritytech/polkadot".`,
      );
    }
    throw e;
  }
}
