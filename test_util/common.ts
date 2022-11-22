export type RUNTIME_CODES = typeof RUNTIME_CODES
export const RUNTIME_CODES = {
  polkadot: 0,
  kusama: 1,
  westend: 2,
  rococo: 3,
} as const

export type RuntimeName = keyof RUNTIME_CODES
export const RUNTIME_NAMES: { [N in RuntimeName as RUNTIME_CODES[N]]: N } = {
  0: "polkadot",
  1: "kusama",
  2: "westend",
  3: "rococo",
}

export function isRuntimeName(inQuestion: string): inQuestion is RuntimeName {
  return Object.values(RUNTIME_NAMES).includes(inQuestion as never)
}

export class InvalidRuntimeSpecifiedError extends Error {
  override readonly name = "InvalidRuntimeSpecifiedError"

  constructor(readonly specified: string) {
    super(
      `There is no test runtime with the name "${specified}". Please specify one of the following values: ${
        Object.values(RUNTIME_NAMES).join(", ")
      }`,
    )
  }
}

export class PolkadotBinNotFoundError extends Error {
  override readonly name = "PolkadotBinNotFoundError"

  constructor() {
    super(
      "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
        + `For more information, visit the following link: "https://github.com/paritytech/polkadot".`,
    )
  }
}

export function polkadotProcess(port: number, runtimeName: RuntimeName) {
  const cmd = ["polkadot", "--dev", "--ws-port", port.toString()]
  if (runtimeName !== "polkadot") {
    cmd.push(`--force-${runtimeName}`)
  }
  try {
    // TODO: decide which specific logs to pipe to this file's process
    return Deno.run({
      cmd,
      stdout: "piped",
      stderr: "piped",
    })
  } catch (_e) {
    throw new PolkadotBinNotFoundError()
  }
}

export function getOpenPort(): number {
  const tmp = Deno.listen({ port: 0 })
  const { port } = (tmp.addr as Deno.NetAddr)
  tmp.close()
  return port
}

export async function portReady(port: number): Promise<void> {
  let attempts = 60
  while (--attempts) {
    try {
      const connection = await Deno.connect({ port })
      connection.close()
      break
    } catch (e) {
      if (e instanceof Deno.errors.ConnectionRefused && attempts > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else {
        throw new Error()
      }
    }
  }
}
