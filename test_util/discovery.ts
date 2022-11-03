import * as Z from "../deps/zones.ts";
import * as C from "../mod.ts";

const testCtxPath = new URL("../test_ctx.ts", import.meta.url).pathname;
const testCtxCmd = ["deno", "task", "run", testCtxPath, "deno", "task", "run", Deno.mainModule];

class DevChain {
  #url?: Promise<string>;
  #client?: Promise<Z.Effect<C.rpc.Client<string, Event, Event, Event>, never, never>>;

  // TODO ensure idempotent
  constructor(readonly runtime: TestDiscovery.Name) {}

  get url(): Promise<string> {
    if (!this.#url) {
      const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
      const portRaw = Deno.env.get("TEST_CTX_PORT");
      this.#url = (async () => {
        if (!hostname || !portRaw) {
          const p = Deno.run({ cmd: testCtxCmd });
          const { code } = await p.status();
          Deno.exit(code);
        }
        const conn = await Deno.connect({
          hostname,
          port: parseInt(portRaw!),
        });
        conn.write(new Uint8Array([TestDiscovery.CODES[this.runtime]]));
        const port = await (async () => {
          for await (const x of conn.readable) {
            return new DataView(x.buffer).getUint16(0);
          }
          return undefined!;
        })();
        return `ws://127.0.0.1:${port}`;
      })();
    }
    return this.#url;
  }

  get client() {
    if (!this.#client) {
      this.#client = (async () => {
        return C.rpcClient(C.rpc.proxyProvider, await this.url);
      })();
    }
    return this.#client;
  }
}

export const polkadot = new DevChain("polkadot");
export const kusama = new DevChain("kusama");
export const westend = new DevChain("westend");
export const rococo = new DevChain("rococo");

export const devChains = { polkadot, kusama, westend, rococo };

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
