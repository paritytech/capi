// TODO: rename this task

import { parse } from "../deps/std/flags.ts"
import { Buffer, readLines } from "../deps/std/io.ts"
import * as path from "../deps/std/path.ts"
import { writeAll } from "../deps/std/streams.ts"
import { assert } from "../deps/std/testing/asserts.ts"

const { dir } = parse(Deno.args, {
  string: ["dir"],
  default: {
    dir: "examples",
  },
})

const ignoreFile = await Deno.readTextFile(path.join(dir, ".ignore"))
const ignoredFiles = new Set(ignoreFile.split("\n"))

const exampleFileNames = Array.from(Deno.readDirSync(dir))
  .filter((e) => e.name.match(/^.*\.ts$/g) && e.isFile && !ignoredFiles.has(e.name))
  .map((f) => f.name)

Deno.test("examples", async (t) => {
  await Promise.all(exampleFileNames.map((fileName) => {
    return t.step({
      name: fileName,
      async fn() {
        const task = Deno.run({
          cmd: ["deno", "run", "-A", "-r=http://localhost:4646/", `${dir}/${fileName}`],
          stdout: "piped",
          stderr: "piped",
        })

        try {
          const out = new Buffer()

          await Promise.all([pipeThrough(task.stdout, out), pipeThrough(task.stderr, out)])

          const status = await task.status()

          if (!status.success) {
            for await (const line of readLines(out)) {
              console.log(line)
            }
          }
          assert(status.success, `task failed with status code: ${status.code}`)
        } finally {
          task.stdout.close()
          task.stderr.close()
          task.close()
        }
      },
      sanitizeExit: false,
      sanitizeOps: false,
      sanitizeResources: false,
    })
  }))
})

async function pipeThrough(reader: Deno.Reader, writer: Deno.Writer) {
  const encoder = new TextEncoder()
  for await (const line of readLines(reader)) {
    await writeAll(writer, encoder.encode(`${line}\n`))
  }
}
