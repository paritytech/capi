export function getAvailable(): number {
  const tmp = Deno.listen({ port: 0 })
  const { port } = tmp.addr as Deno.NetAddr
  tmp.close()
  return port
}

export async function ready(port: number, maxAttempts?: number): Promise<void> {
  let i = maxAttempts ?? 60
  while (i--) {
    try {
      const connection = await Deno.connect({ port })
      connection.close()
      break
    } catch (e) {
      if (e instanceof Deno.errors.ConnectionRefused && i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else throw new Error()
    }
  }
}
