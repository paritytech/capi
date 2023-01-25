import { File } from "./File.ts"

export class Codegen {
  files: Record<string, File> = {};

  [Symbol.iterator]() {
    return Object.entries(this.files)[Symbol.iterator]()
  }
}
