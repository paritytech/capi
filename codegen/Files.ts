import { tsFormatter } from "../deps/dprint.ts"
import * as path from "../deps/std/path.ts"
import { S } from "./utils.ts"

export type File = { getContent: () => S }
export class Files extends Map<string, File> {
  async write(outDir: string) {
    const errors = []
    try {
      await Deno.remove(outDir, { recursive: true })
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) {
        throw e
      }
    }
    await Deno.mkdir(outDir, { recursive: true })
    for (const [relativePath, file] of this.entries()) {
      const outputPath = path.join(outDir, relativePath)
      const content = S.toString(file.getContent())
      try {
        const formatted = tsFormatter.formatText("gen.ts", content)
        await Deno.writeTextFile(outputPath, formatted)
      } catch (e) {
        await Deno.writeTextFile(outputPath, content)
        errors.push(e)
      }
    }
    if (errors.length) {
      throw errors
    }
  }
}
