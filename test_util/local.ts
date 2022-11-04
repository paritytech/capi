import * as Z from "../deps/zones.ts";
import * as C from "../mod.ts";

class LocalClient extends C.rpc.Client<string, Event, Event, Event> {
  constructor(url: string, readonly close: () => void) {
    super(C.rpc.proxyProvider, url);
  }

  override discard = () => {
    this.close();
    return super.discard();
  };
}

type LocalInitResult = [url: string, cleanUp: () => void];

function localInit(runtime: TestDiscovery.Name) {
  const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
  const portRaw = Deno.env.get("TEST_CTX_PORT");
  let close = () => {};
  return async (): Promise<LocalInitResult> => {
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
      conn.write(new Uint8Array([TestDiscovery.CODES[runtime]]));
      port = await (async () => {
        for await (const x of conn.readable) {
          return new DataView(x.buffer).getUint16(0);
        }
        return undefined!;
      })();
    }
    return [`ws://127.0.0.1:${port}`, close];
  };
}

export function localClient(
  runtime: TestDiscovery.Name,
): Z.Effect<LocalClient, never, never> & {
  url: Promise<string>;
  close: () => void;
} {
  const init = localInit(runtime);
  let initResult: undefined | Promise<LocalInitResult>;
  let close: () => void;
  return Object.assign(
    Z.call(0, () => {
      if (!initResult) {
        initResult = init();
      }
      return (async () => {
        const [url, close_] = await initResult!;
        close = close_;
        return new LocalClient(url, close_);
      })();
    }),
    {
      get url() {
        if (!initResult) {
          initResult = init();
        }
        return (async () => {
          const [url, close_] = await initResult!;
          close = close_;
          return url;
        })();
      },
      close() {
        close();
      },
    },
  );
}

export namespace TestDiscovery {
  export type CODES = typeof CODES;
  export const CODES = {
    polkadot: 0,
    kusama: 1,
    westend: 2,
    rococo: 3,
  } as const;
  export type Name = keyof CODES;
  export const NAMES: { [N in Name as CODES[N]]: N } = {
    0: "polkadot",
    1: "kusama",
    2: "westend",
    3: "rococo",
  };
}

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

export function spawnDevNetProcess(port: number, runtimeName: TestDiscovery.Name) {
  const cmd = ["polkadot", "--dev", "--ws-port", port.toString()];
  if (runtimeName !== "polkadot") {
    cmd.push(`--force-${runtimeName}`);
  }
  try {
    return Deno.run({
      cmd,
      stdout: "piped",
      stderr: "piped",
    });
    // TODO: inherit specific logs (how to filter?)
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      throw new Error(
        `Must have Polkadot installed locally. Visit "https://github.com/paritytech/polkadot".`,
      );
    }
    throw e;
  }
}

export function getOpenPort(): number {
  const tmp = Deno.listen({ port: 0 });
  const { port } = (tmp.addr as Deno.NetAddr);
  tmp.close();
  return port;
}
