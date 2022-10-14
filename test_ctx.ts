import { TestConfigRuntime } from "./test_util/config.ts";

interface DevNet {
  port: number;
  process: Deno.Process;
}
type DevNets = Partial<Record<TestConfigRuntime.Name, DevNet>>;
const devNets: DevNets = {};

const listener = Deno.listen({
  transport: "tcp",
  port: 0,
});
if (listener.addr.transport !== "tcp") {
  throw new Error();
}
useListener(listener, devNets);

const cmdProcess = Deno.run({
  cmd: Deno.args,
  env: {
    TEST_CTX_HOSTNAME: listener.addr.hostname,
    TEST_CTX_PORT: listener.addr.port.toString(),
  },
});
await cmdProcess.status();
cleanup();

async function useListener(listener: Deno.Listener, lookup: DevNets) {
  for await (const conn of listener) {
    useConn(conn);
  }

  async function useConn(conn: Deno.Conn) {
    for await (const e of conn.readable) {
      const e0 = e.at(0);
      if (typeof e0 !== "number") {
        throw new Error();
      }
      const runtimeName = (TestConfigRuntime.NAMES as Record<number, TestConfigRuntime.Name>)[e0];
      if (!runtimeName) {
        throw new Error();
      }
      let processContainer = lookup[runtimeName];
      if (!processContainer) {
        const port = getOpenPort();
        processContainer = {
          port,
          process: spawnDevNetProcess(port, runtimeName),
        };
        lookup[runtimeName] = processContainer;
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

async function portReady(port: number): Promise<void> {
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

function spawnDevNetProcess(port: number, runtimeName: TestConfigRuntime.Name) {
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

function getOpenPort(): number {
  const tmp = Deno.listen({ port: 0 });
  const { port } = (tmp.addr as Deno.NetAddr);
  tmp.close();
  return port;
}
