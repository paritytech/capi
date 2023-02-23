export function getAvailable(): number {
  const tmp = Deno.listen({ port: 0 })
  const { port } = tmp.addr as Deno.NetAddr
  tmp.close()
  return port
}

export async function ready(port: number): Promise<void> {
  while (true) {
    try {
      const connection = await Deno.connect({ port })
      connection.close()
      break
    } catch (e) {
      if (e instanceof Deno.errors.ConnectionRefused) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else throw new Error()
    }
  }
}
