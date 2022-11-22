import { tsFormatter } from "../deps/dprint.ts"

export class Files extends Map<string, () => string> {
  getFormatted(key: string) {
    const file = this.get(key)
    if (!file) return undefined
    return tsFormatter.formatText(key, file())
  }
}
