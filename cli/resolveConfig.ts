import * as flags from "../deps/std/flags.ts"
import * as path from "../deps/std/path.ts"
import { Config } from "../devnets/mod.ts"

export async function resolveConfig(...args: string[]) {
  const { config: rawConfigPath } = flags.parse(args, {
    string: ["config"],
    default: {
      config: "./capi.config.ts",
    },
  })
  const configPath = path.resolve(rawConfigPath)
  await Deno.stat(configPath)
  const configModule = await import(path.toFileUrl(configPath).toString())
  const config = configModule.config
  if (typeof config !== "object") throw new Error("config file must have a config export")

  return config as Config
}
