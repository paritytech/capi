import * as Z from "../deps/zones.ts";
import * as C from "../mod.ts";

const testCtxPath = new URL("../test_ctx.ts", import.meta.url).pathname;
const currentCmd = ["deno", "task", "run", Deno.mainModule];
const testCtxCmd = ["deno", "task", "run", testCtxPath, ...currentCmd];

export type TestClient =
  & Z.Effect<C.rpc.Client<string, Event, Event, Event>, never, never>
  & { url: Promise<string> };

function testClient(runtime: TestDiscovery.Name): TestClient {
  const getUrl = testClientUrlGetter(runtime);
  let client: undefined | TestClient;
  if (!client) {
    // TODO: in zones, enable supplying promises and unwrap in `T`
    client = Object.assign(C.rpcClient(C.rpc.proxyProvider, Z.call(0, getUrl)), {
      url: getUrl(),
    });
  }
  return client;
}

function testClientUrlGetter(runtime: TestDiscovery.Name) {
  let url: undefined | Promise<string>;
  return async () => {
    if (!url) {
      const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
      const portRaw = Deno.env.get("TEST_CTX_PORT");
      if (!hostname || !portRaw) {
        const p = Deno.run({ cmd: testCtxCmd });
        const { code } = await p.status();
        Deno.exit(code);
      }
      url = (async () => {
        const conn = await Deno.connect({
          hostname,
          port: parseInt(portRaw!),
        });
        conn.write(new Uint8Array([TestDiscovery.CODES[runtime]]));
        const port = await (async () => {
          for await (const x of conn.readable) {
            return new DataView(x.buffer).getUint16(0);
          }
          return undefined!;
        })();
        return `ws://127.0.0.1:${port}`;
      })();
    }
    return url;
  };
}

export const polkadot = testClient("polkadot");
export const kusama = testClient("kusama");
export const westend = testClient("westend");
export const rococo = testClient("rococo");

export const clients = { polkadot, kusama, westend, rococo };

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
