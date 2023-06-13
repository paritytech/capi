// @ts-ignore V8 special property
Error.stackTraceLimit = Infinity

const traceLookup = new Map<string, WeakRef<Trace>>()
const cleanUpLookup = new FinalizationRegistry((key: string) => {
  traceLookup.delete(key)
})

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
const original = Error.prepareStackTrace ?? prepareStackTrace

// @ts-ignore V8 special property
Error.prepareStackTrace = (err, sites) => {
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
if ("Deno" in globalThis) {
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

function prepareStackTrace(error: Error, sites: any[]) {
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

function formatLocation(site: any) {
  if (site.isNative()) {
    return "native"
  }
  let result = ""
  if (site.fileName()) {
    result += site.fileName()
  } else {
    if (site.isEval()) {
      if (site.evalOrigin() == null) {
        throw new Error("assert evalOrigin")
      }
      result += `${site.evalOrigin()}, `
    }
    result += "<anonymous>"
  }
  if (site.lineNumber() != null) {
    result += `:${site.lineNumber()}`
    if (site.columnNumber() != null) {
      result += `:${site.columnNumber()}`
    }
  }
  return result
}

function formatCallSite(site: any) {
  let result = ""
  if (site.isAsync()) {
    result += "async "
  }
  if (site.isPromiseAll()) {
    result += `Promise.all (index ${site.promiseIndex()})`
    return result
  }
  const isMethodCall = !(site.isToplevel() || site.isConstructor())
  if (isMethodCall) {
    if (site.functionName()) {
      if (site.typeName()) {
        if (!site.functionName.startsWith(site.typeName())) {
          result += `${site.typeName()}.`
        }
      }
      result += site.functionName()
      if (site.methodName()) {
        if (!site.functionName().endsWith(site.methodName())) {
          result += ` [as ${site.methodName()}]`
        }
      }
    } else {
      if (site.typeName()) {
        result += `${site.typeName()}.`
      }
      if (site.methodName()) {
        result += site.methodName()
      } else {
        result += "<anonymous>"
      }
    }
  } else if (site.isConstructor()) {
    result += "new "
    if (site.functionName()) {
      result += site.functionName()
    } else {
      result += "<anonymous>"
    }
  } else if (site.functionName()) {
    result += site.functionName()
  } else {
    result += formatLocation(site)
    return result
  }

  result += ` (${formatLocation(site)})`
  return result
}
