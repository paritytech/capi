// deno-lint-ignore-file
import { readableStreamFromReader, writableStreamFromWriter } from "../std/streams.ts"

export class Command implements Deno.Command {
  #command
  #options
  constructor(command: string, options?: Deno.CommandOptions) {
    this.#command = command
    this.#options = options
  }

  async output(): Promise<Deno.CommandOutput> {
    const {
      cwd,
      args = [],
      stdin = "inherit",
      stdout = "piped",
      stderr = "piped",
      env,
      signal,
    } = this.#options ?? {}
    const process = Deno.run({
      cmd: [this.#command, ...args],
      cwd: cwd as string | undefined,
      stdin,
      stdout,
      stderr,
      env,
    })

    signal?.addEventListener("abort", () => {
      try {
        process.kill("SIGKILL")
      } catch {}
    })

    return new ChildProcess(process).output()
  }

  outputSync(): Deno.CommandOutput {
    throw new Error("not implemented")
  }

  spawn(): ChildProcess {
    const {
      cwd,
      args = [],
      stdin = "inherit",
      stdout = "inherit",
      stderr = "inherit",
      env,
      signal,
    } = this.#options ?? {}
    const process = Deno.run({
      cmd: [this.#command, ...args],
      cwd: cwd as string | undefined,
      stdin,
      stdout,
      stderr,
      env,
    })

    signal?.addEventListener("abort", () => {
      try {
        process.kill("SIGKILL")
      } catch {}
    })

    return new ChildProcess(process)
  }
}

class ChildProcess implements Deno.ChildProcess {
  get pid() {
    return this.#process.pid
  }
  #status?: Promise<Deno.CommandStatus>
  get status() {
    return this.#status ??= this.#process.status().then((status) => {
      return {
        code: status.code,
        success: status.success,
        signal: null,
      }
    })
  }
  #stdin?: WritableStream<Uint8Array>
  get stdin() {
    return this.#stdin ??= writableStreamFromWriter(this.#process.stdin!)
  }
  #stdout?: ReadableStream<Uint8Array>
  get stdout() {
    return this.#stdout ??= readableStreamFromReader(this.#process.stdout!)
  }
  #stderr?: ReadableStream<Uint8Array>
  get stderr() {
    return this.#stderr ??= readableStreamFromReader(this.#process.stderr!)
  }
  #process
  constructor(process: Deno.Process) {
    this.#process = process
  }
  ref() {
    throw new Error("not implemented")
  }
  unref() {
    throw new Error("not implemented")
  }
  kill(signal: Deno.Signal) {
    this.#process.kill(signal)
  }
  async output(): Promise<Deno.CommandOutput> {
    const [
      status,
      stdoutData,
      stderrData,
    ] = await Promise.all([
      this.#process.status(),
      this.#process.stdout ? this.#process.output() : null,
      this.#process.stderr ? this.#process.stderrOutput() : null,
    ])

    return {
      code: status.code,
      success: status.success,
      signal: null,
      stdout: stdoutData!,
      stderr: stderrData!,
    }
  }
}
