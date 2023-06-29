// @ts-ignore V8 special property
Error.stackTraceLimit = Infinity

const traceLookup = new Map<string, WeakRef<Trace>>()
const cleanUpLookup = new FinalizationRegistry((key: string) => {
  traceLookup.delete(key)
})

/** a means of finding the rune instantiations responsible for that which is unhandled */
export class Trace extends Error {
  declare from: string
  declare id: string

  constructor(name: string) {
    super()
    Object.defineProperty(this, "id", { value: marker + crypto.randomUUID() })
    traceLookup.set(this.id, new WeakRef(this))
    cleanUpLookup.register(this, this.id)
    Object.defineProperty(this, "name", { value: name })
    Object.defineProperty(this, "from", { value: ("from " + this.stack).replace(/^/gm, "    ") })
  }

  static _current?: Trace

  run<T>(fn: () => T): T {
    const prev = Trace._current
    Trace._current = this
    try {
      return {
        [this.id]() {
          return fn()
        },
      }[this.id]!()
    } finally {
      Trace._current = prev
    }
  }

  async runAsync<T>(fn: () => Promise<T>): Promise<T> {
    const prev = Trace._current
    Trace._current = this
    try {
      return await {
        async [this.id]() {
          return await fn()
        },
      }[this.id]!()
    } finally {
      Trace._current = prev
    }
  }
}

const marker = "__capi_rune_trace_marker-"

// @ts-ignore V8 special property
const original: (err: Error, sites: Site[]) => string = Error.prepareStackTrace ?? prepareStackTrace

// @ts-ignore V8 special property
Error.prepareStackTrace = (err: Error, sites: Site[]): string => {
  for (let i = 0; i < sites.length; i++) {
    const fnName = sites[i]!.getFunctionName()
    if (fnName?.startsWith(marker)) {
      const trace = traceLookup.get(fnName)?.deref()
      if (trace) {
        return original(err, sites.slice(0, i)) + "\n" + trace.from
      }
    }
  }
  return original(err, sites)
}

// Force deno to use the custom prepareStackTrace when an error isn't handled
if ("Deno" in globalThis && !("_isShim" in Deno)) {
  globalThis.addEventListener("error", (e) => {
    handler(e.error)
  })
  globalThis.addEventListener("unhandledrejection", (e) => {
    handler(e.reason)
  })
  // deno-lint-ignore no-inner-declarations
  function handler(e: any) {
    if (e instanceof Error) {
      throw {
        [Symbol.for("Deno.customInspect")](inspect: any, options: any) {
          return inspect(e, options)
        },
      }
    }
  }
}

// Adapted from https://github.com/denoland/deno/blob/53487786/core/02_error.js

function prepareStackTrace(error: Error, sites: Site[]) {
  const formattedCallSites = sites
    .map(formatCallSite)
  const message = error.message !== undefined ? error.message : ""
  const name = error.name !== undefined ? error.name : "Error"
  let messageLine
  if (name != "" && message != "") {
    messageLine = `${name}: ${message}`
  } else if ((name || message) != "") {
    messageLine = name || message
  } else {
    messageLine = ""
  }
  return messageLine + formattedCallSites.map((s) => `\n    at ${s}`).join("")
}

function formatLocation(site: Site) {
  if (site.isNative()) {
    return "native"
  }
  let result = ""
  if (site.getFileName()) {
    result += site.getFileName()
  } else {
    if (site.isEval()) {
      if (site.getEvalOrigin() == null) {
        throw new Error("assert evalOrigin")
      }
      result += `${site.getEvalOrigin()}, `
    }
    result += "<anonymous>"
  }
  if (site.getLineNumber() != null) {
    result += `:${site.getLineNumber()}`
    if (site.getColumnNumber() != null) {
      result += `:${site.getColumnNumber()}`
    }
  }
  return result
}

interface Site {
  getTypeName(): string | undefined
  getFunctionName(): string | undefined
  getMethodName(): string | undefined
  getFileName(): string | undefined
  getLineNumber(): string | undefined
  getColumnNumber(): string | undefined
  getEvalOrigin(): string | undefined
  isToplevel(): boolean
  isEval(): boolean
  isNative(): boolean
  isConstructor(): boolean
  isAsync(): boolean
  isPromiseAll(): boolean
  getPromiseIndex(): number | null
}

function formatCallSite(site: Site) {
  let result = ""
  if (site.isAsync()) {
    result += "async "
  }
  if (site.isPromiseAll()) {
    result += `Promise.all (index ${site.getPromiseIndex()})`
    return result
  }
  const isMethodCall = !(site.isToplevel() || site.isConstructor())
  if (isMethodCall) {
    if (site.getFunctionName()) {
      if (site.getTypeName()) {
        if (!site.getFunctionName()!.startsWith(site.getTypeName()!)) {
          result += `${site.getTypeName()}.`
        }
      }
      result += site.getFunctionName()
      if (site.getMethodName()) {
        if (!site.getFunctionName()!.endsWith(site.getMethodName()!)) {
          result += ` [as ${site.getMethodName()}]`
        }
      }
    } else {
      if (site.getTypeName()) {
        result += `${site.getTypeName()}.`
      }
      if (site.getMethodName()) {
        result += site.getMethodName()
      } else {
        result += "<anonymous>"
      }
    }
  } else if (site.isConstructor()) {
    result += "new "
    if (site.getFunctionName()) {
      result += site.getFunctionName()
    } else {
      result += "<anonymous>"
    }
  } else if (site.getFunctionName()) {
    result += site.getFunctionName()
  } else {
    result += formatLocation(site)
    return result
  }

  result += ` (${formatLocation(site)})`
  return result
}
