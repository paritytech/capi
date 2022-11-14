import { tsFormatter } from "../deps/dprint.ts"
import * as path from "../deps/std/path.ts"

export class Files extends Map<string, () => string> {
  async write(outDir: string) {
    outDir = path.normalize(outDir)
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
      if (path.dirname(outputPath) !== outDir) {
        await Deno.mkdir(path.dirname(outputPath), { recursive: true })
      }
      console.time(relativePath)
      const content = file()
      console.timeEnd(relativePath)
      try {
        console.time(relativePath + " fmt")
        const formatted = tsFormatter.formatText("gen.ts", content)
        console.timeEnd(relativePath + " fmt")
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
