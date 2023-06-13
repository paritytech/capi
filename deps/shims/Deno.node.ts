import * as fs from "node:fs"
import { Command } from "./command.node.ts"

declare const process: { env: Record<string, string> }
let _deno = {
  errors: {
    NotFound: class NotFound extends Error {},
    AlreadyExists: class AlreadyExists extends Error {},
  },
  env: {
    // @ts-ignore .
    get: (key: string) => process.env[key],
    set: (key: string, value: string) => {
      process.env[key] = value
    },
    has: (key: string) => key in process.env,
    delete: (key: string) => {
      delete process.env[key]
    },
    toObject: () => ({ ...process.env }),
  },
  readFileSync: (path: string | URL): Uint8Array => fs.readFileSync(path),
  readTextFileSync: (path: string | URL): string => fs.readFileSync(path, "utf8"),
} as any as typeof globalThis.Deno

export const Deno = new Proxy(
  {},
  new Proxy(Reflect, {
    // @ts-ignore .
    get: (_, key) => (_, ...x) => Reflect[key](_deno, ...x),
  }),
)

export function register(newDeno: typeof globalThis.Deno) {
  _deno = newDeno
  _deno.Command = Command
}
