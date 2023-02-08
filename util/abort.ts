export function abortIfAny(...signals: AbortSignal[]): AbortController {
  const controller = new AbortController()
  for (const signal of signals) {
    signal.addEventListener("abort", () => controller.abort(), { signal: controller.signal })
  }
  return controller
}

export function abortIfAll(...signals: AbortSignal[]): AbortController {
  const controller = new AbortController()
  let remaining = signals.length
  for (const signal of signals) {
    signal.addEventListener("abort", () => {
      if (!--remaining) controller.abort()
    }, { signal })
  }
  return controller
}
