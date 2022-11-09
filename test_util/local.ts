import * as Z from "../deps/zones.ts";
import * as C from "../mod.ts";
import * as common from "./common.ts";

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

export class LocalClientEffect extends Z.Effect<LocalClient, common.PolkadotBinNotFoundError> {
  #clientPending?: Promise<LocalClient>;

  constructor(readonly runtime: common.RuntimeName) {
    const getClientContainer: { getClient?: () => Promise<LocalClient> } = {};
    super({
      kind: "LocalClient",
      impl: Z
        .call(async () => {
          try {
            return await getClientContainer.getClient!();
          } catch (e) {
            return e as common.PolkadotBinNotFoundError;
          }
        })
        .impl,
      items: [runtime],
      memoize: true,
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
      conn.write(new Uint8Array([common.RUNTIME_CODES[this.runtime]]));
      port = await (async () => {
        for await (const x of conn.readable) {
          return new DataView(x.buffer).getUint16(0);
        }
        return null!;
      })();
    } else {
      port = common.getOpenPort();
      const process = common.polkadotProcess(port, this.runtime);
      close = () => {
        process.kill("SIGKILL");
        process.close();
      };
      await common.portReady(port);
    }
    return new LocalClient(port, close);
  }
}
