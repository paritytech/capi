declare global {
  interface Process {
    env: Record<string, string>
  }
  export const process: Process | undefined
}
export function tryGetEnv(name: string): string | undefined {
  return typeof process !== "undefined" ? process.env?.[name] : undefined
}
