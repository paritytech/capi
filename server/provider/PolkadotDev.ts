import { Client, proxyProvider } from "../../rpc/mod.ts"
import * as port from "../../util/port.ts"
import { Provider } from "./common.ts"

export interface PolkadotDevPathInfo {
  runtimeName: DevRuntimeName
  runtimeVersion: string
  tsFilePath: string
}

export interface PolkadotDevProviderProps {
  polkadotPath?: string
  additional?: string[]
}

export class PolkadotDevProvider extends Provider<PolkadotDevPathInfo> {
  providerMatches = { dev: true }

  #nets: Partial<Record<DevRuntimeName, Promise<Client>>> = {}

  constructor(readonly props?: PolkadotDevProviderProps) {
    super()
  }

  tryParsePathInfo(path: string) {
    const slashI0 = path.search("/")
    const runtimeName = path.slice(0, slashI0)
    if (!isDevRuntimeName(runtimeName)) {
      return {
        error:
          `${runtimeName} is not a valid dev runtime name. Please specify one of the following: "${
            DEV_RUNTIME_NAMES.join(`", "`)
          }."`,
      }
    }
    const slash0Trailing = path.slice(slashI0 + 1)
    if (slash0Trailing[0] != "@") {
      return {
        error: `Expected "@" character and version to follow "${runtimeName}" but found "${
          slash0Trailing[0]
        }..." instead.`,
      }
    }
    const slashI1 = slash0Trailing.search("/")
    if (slashI1 != 1) return { error: `Expected "/:path" after version, found none.` }
    const runtimeVersion = slash0Trailing.slice(1, slashI1)
    const tsFilePath = slash0Trailing.slice(slashI1 + 1)
    return { runtimeName, runtimeVersion, tsFilePath }
  }

  async client({ runtimeName }: PolkadotDevPathInfo) {
    let clientPending = this.#nets[runtimeName]
    if (!clientPending) {
      const port_ = port.getAvailable()
      const polkadotPath = this.props?.polkadotPath ?? "polkadot"
      try {
        await Deno.lstat(polkadotPath)
      } catch (e) {
        console.log(e instanceof Deno.errors.NotFound ? POLKADOT_PATH_NOT_FOUND : e)
        Deno.exit(1)
      }
      const cmd: string[] = [
        this.props?.polkadotPath ?? "polkadot",
        "--dev",
        "--ws-port",
        port_.toString(),
        ...this.props?.additional ?? [],
      ]
      if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
      const process = Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped",
      })
      this.ctx.signal.addEventListener("abort", async () => {
        process.kill("SIGINT")
        await process.status()
        process.close()
      })
      clientPending = port.isReady(port_)
        .then(() => new Client(proxyProvider, `ws://${Deno.hostname()}:${port_}`))
      this.#nets[runtimeName] = clientPending
    }
    return clientPending
  }
}

export const DEV_RUNTIME_NAMES = ["polkadot", "kusama", "westend", "rococo"] as const
export type DevRuntimeName = typeof DEV_RUNTIME_NAMES[number]

export function isDevRuntimeName(inQuestion: string): inQuestion is DevRuntimeName {
  return !!(DEV_RUNTIME_NAME_EXISTS as Record<string, true>)[inQuestion]
}
const DEV_RUNTIME_NAME_EXISTS: Record<DevRuntimeName, true> = {
  polkadot: true,
  kusama: true,
  westend: true,
  rococo: true,
}

const POLKADOT_PATH_NOT_FOUND =
  "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
  + `For more information, visit the following link: "https://github.com/paritytech/polkadot".`
