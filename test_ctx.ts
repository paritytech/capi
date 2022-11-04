import { getOpenPort, portReady, spawnDevNetProcess, TestDiscovery } from "./test_util/local.ts";

const devNets: Partial<
  Record<TestDiscovery.Name, {
    port: number;
    process: Deno.Process;
  }>
> = {};

const listener = Deno.listen({
  transport: "tcp",
  port: 0,
});
if (listener.addr.transport !== "tcp") {
  throw new Error();
}
useListener(listener);

const cmdProcess = Deno.run({
  cmd: Deno.args,
  env: {
    TEST_CTX_HOSTNAME: listener.addr.hostname,
    TEST_CTX_PORT: listener.addr.port.toString(),
  },
});
const status = await cmdProcess.status();
cleanup();

Deno.exit(status.code);

async function useListener(listener: Deno.Listener) {
  for await (const conn of listener) {
    useConn(conn);
  }

  async function useConn(conn: Deno.Conn) {
    for await (const e of conn.readable) {
      const e0 = e.at(0);
      if (typeof e0 !== "number") {
        throw new Error();
      }
      const runtimeName = (TestDiscovery.NAMES as Record<number, TestDiscovery.Name>)[e0];
      if (!runtimeName) {
        throw new Error();
      }
      let processContainer = devNets[runtimeName];
      if (!processContainer) {
        const port = getOpenPort();
        processContainer = {
          port,
          process: spawnDevNetProcess(port, runtimeName),
        };
        devNets[runtimeName] = processContainer;
      }
      const message = new Uint8Array(2);
      new DataView(message.buffer).setUint16(0, processContainer.port);
      (async () => {
        await portReady(processContainer.port);
        conn.write(message);
      })();
    }
  }
}

function cleanup() {
  listener.close();
  for (const { process } of Object.values(devNets)) {
    process.kill("SIGKILL");
    process.close();
  }
}
