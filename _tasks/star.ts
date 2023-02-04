import { parse } from "../deps/std/flags.ts"
import * as fs from "../deps/std/fs.ts"

const { ignore } = parse(Deno.args, { string: ["ignore"] })
for await (
  const entry of fs.walk(".", {
    match: [/\.ts$/],
    skip: [/^target\//, ...ignore ? [new RegExp(ignore)] : []],
  })
) {
  const status = await Deno.run({ cmd: ["deno", "cache", "--check", entry.path] })
    .status()
  if (!status.success) Deno.exit(status.code)
}
