import * as Z from "../deps/zones.ts";
import * as C from "../mod.ts";

const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
const portRaw = Deno.env.get("TEST_CTX_PORT");

class LocalClient extends C.rpc.Client<string, Event, Event, Event> {
  url;

  constructor(port: number, close: () => void) {
    const url = `ws://127.0.0.1:${port}`;
    super(C.rpc.proxyProvider, url);
    this.url = url;
    const prevDiscard = this.discard;
    this.discard = async () => {
      const closeError = await prevDiscard();
      close();
      return closeError;
    };
  }
}

export class LocalClientEffect extends Z.Effect<LocalClient, PolkadotBinNotFoundError> {
  #clientPending?: Promise<LocalClient>;

  constructor(readonly runtime: RuntimeName) {
    const getClientContainer: { getClient?: () => Promise<LocalClient> } = {};
    super({
      kind: "LocalClient",
      impl: Z
        .call(async () => {
          try {
            return await getClientContainer.getClient!();
          } catch (e) {
            return e as PolkadotBinNotFoundError;
          }
        })
        .impl,

      items: [runtime],
    });
    getClientContainer.getClient = this.createClient.bind(this);
  }

  get client(): Promise<LocalClient> {
    if (!this.#clientPending) {
      this.#clientPending = this.createClient();
    }
    return this.#clientPending;
  }

  get url(): Promise<string> {
    return this.client.then(({ url }) => url);
  }

  private async createClient(): Promise<LocalClient> {
    let port: number;
    let close = () => {};
    if (portRaw /* in a test ctx */) {
      const conn = await Deno.connect({
        hostname,
        port: parseInt(portRaw!),
      });
      conn.write(new Uint8Array([RUNTIME_CODES[this.runtime]]));
      port = await (async () => {
        for await (const x of conn.readable) {
          return new DataView(x.buffer).getUint16(0);
        }
        return null!;
      })();
    } else {
      port = getOpenPort();
      const process = polkadotProcess(port, this.runtime);
      close = () => {
        process.kill("SIGKILL");
        process.close();
      };
      await portReady(port);
    }
    return new LocalClient(port, close);
  }
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

export class PolkadotBinNotFoundError extends Error {
  override readonly name = "PolkadotBinNotFoundError";
  override readonly message =
    "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
    + `For more information, visit the following link: "https://github.com/paritytech/polkadot".`;
}

export function polkadotProcess(port: number, runtimeName: RuntimeName) {
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
  } catch (_e) {
    throw new PolkadotBinNotFoundError();
  }
}
