declare const process: { exitCode: number }

export function gracefulExit(code: number) {
  process.exitCode = code
}
