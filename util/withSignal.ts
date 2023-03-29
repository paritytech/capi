export async function withSignal<T>(
  cb: (signal: AbortSignal) => Promise<T>,
  outerSignal?: AbortSignal,
) {
  const controller = new AbortController()
  if (outerSignal) {
    outerSignal.addEventListener("abort", () => {
      controller.abort()
    }, { signal: controller.signal })
  }
  try {
    return await cb(controller.signal)
  } finally {
    controller.abort()
  }
}
