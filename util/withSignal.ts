export async function withSignal<T>(cb: (signal: AbortSignal) => Promise<T>) {
  const controller = new AbortController()
  try {
    return await cb(controller.signal)
  } finally {
    controller.abort()
  }
}
