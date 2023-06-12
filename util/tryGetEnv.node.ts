declare global {
  interface Process {
    env: Record<string, string>
  }
  export const process: Process
}
export function tryGetEnv(name: string): string | undefined {
  return process.env?.[name]
}
