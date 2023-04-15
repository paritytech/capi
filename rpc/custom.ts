import { Connection } from "./Connection.ts"

export class CustomConnection extends Connection {
  pending

  constructor(readonly discovery: string) {
    super()
    this.pending = import(discovery).then((x) => x.connect(this.signal)) as Promise<Connection>
  }

  async ready() {
    const connection = await this.pending
    await connection.ready()
  }

  send(id: number, method: string, params: unknown[]) {
    this.pending.then((connection) => connection.send(id, method, params))
  }

  close() {
    this.pending.then((connection) => connection.close())
  }
}
