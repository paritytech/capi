import { Connection } from "./Connection.ts"

export class NoConnection extends Connection {
  constructor() {
    super()
    throw new Error(
      "Cannot construct `NoConnection`; use `chain.with` to substitute `chain`'s connection.",
    )
  }

  async ready() {}
  send() {}
  close() {}
}
