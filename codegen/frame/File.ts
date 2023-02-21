import { tsFormatter } from "../../util/tsFormatter.ts"

export class File {
  constructor(public codeRaw = "") {}

  code(filePath: string): string {
    return tsFormatter.formatText(filePath, this.codeRaw)
  }
}
