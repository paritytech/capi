import * as $ from "../deps/scale.ts"
import { Deferred, deferred } from "../deps/std/async.ts"

const $id = $.compact($.u32)

type Message = $.Native<typeof $message>
const $message = $.taggedUnion("type", [
  $.variant(
    "call",
    $.field("callId", $id),
    $.field("fn", $id),
    $.field("args", $.uint8Array),
  ),
  $.variant(
    "resolve",
    $.field("callId", $id),
    $.field("value", $.uint8Array),
  ),
  $.variant(
    "reject",
    $.field("callId", $id),
    $.field("error", $.str),
  ),
])

type ResolutionMessage = Extract<Message, { type: "resolve" | "reject" }>

export interface Link {
  send(data: Uint8Array): void
  recv(cb: (data: Uint8Array) => void, signal: AbortSignal): void
}

class Scald {
  constructor(readonly connection: Link, readonly signal: AbortSignal) {
    this.connection.recv((data) => {
      const message = $message.decode(data)
      this.recv(message)
    }, this.signal)
  }

  nextHeldId = 0
  held = new Map<number, (data: Uint8Array) => Promise<Uint8Array>>()

  nextCallId = 0
  pending = new Map<number, Deferred<ResolutionMessage>>()

  async recv(message: Message) {
    const { callId } = message
    if (message.type !== "call") {
      this.pending.get(callId)?.resolve(message)
      return
    }
    const held = this.held.get(message.fn)
    if (!held) {
      return this.send({ type: "reject", callId, error: "invalid callId" })
    }
    try {
      const value = await held(message.args)
      this.send({ type: "resolve", callId, value })
    } catch (e) {
      return this.send({ type: "reject", callId, error: Deno.inspect(e) })
    }
  }

  send(message: Message): void {
    this.connection.send($message.encode(message))
  }

  expose(value: (data: Uint8Array) => Promise<Uint8Array>) {
    const id = this.nextHeldId++
    this.held.set(id, value)
    return id
  }

  async call(fn: number, args: Uint8Array) {
    const callId = ++this.nextCallId
    const pending = deferred<ResolutionMessage>()
    this.pending.set(callId, pending)
    this.send({ type: "call", callId, fn, args })
    const result = await pending
    if (result.type === "resolve") return result.value
    throw new ScaldError(result.error)
  }

  async encode<T>($value: $.Codec<T>, value: T) {
    const buf = new $.EncodeBuffer($value._staticSize)
    buf.context.get(ScaldContext).scald = this
    $value._encode(buf, value)
    return buf.finishAsync()
  }

  decode<T>($value: $.Codec<T>, data: Uint8Array): T {
    const buf = new $.DecodeBuffer(data)
    buf.context.get(ScaldContext).scald = this
    return $value._decode(buf)
  }
}

export class ScaldError extends Error {
  override name = "ScaldError"
}

class ScaldContext {
  scald?: Scald
}

export function $fn<A extends unknown[], R>(
  $args: $.Codec<A>,
  $return: $.Codec<R>,
): $.Codec<(...args: A) => Promise<R>> {
  return $.createCodec({
    _metadata: $.metadata("$fn", $fn, $args, $return),
    _staticSize: $id._staticSize,
    _encode(buffer, fn) {
      const scald = buffer.context.get(ScaldContext).scald
      if (!scald) {
        throw new $.ScaleEncodeError(this, fn, "$fn can only be used in a scald context")
      }
      const id = scald.expose(async (data) => {
        const args = scald.decode($args, data)
        const result = await fn(...args)
        return scald.encode($return, result)
      })
      $id._encode(buffer, id)
    },
    _decode(buffer) {
      const scald = buffer.context.get(ScaldContext).scald
      if (!scald) {
        throw new $.ScaleDecodeError(this, buffer, "$fn can only be used in a scald context")
      }
      const id = $id._decode(buffer)
      return async (...args: A) => {
        const data = await scald.call(id, await scald.encode($args, args))
        const result = scald.decode($return, data)
        return result
      }
    },
    _assert(assert) {
      assert.typeof(this, "function")
    },
  })
}

export class WsLink implements Link {
  ready = deferred()
  constructor(readonly ws: WebSocket, signal: AbortSignal) {
    ws.binaryType = "arraybuffer"
    this.ws.addEventListener("open", () => {
      this.ready.resolve()
    })
    signal.addEventListener("abort", () => {
      this.ws.close()
    })
  }

  async send(data: Uint8Array) {
    await this.ready
    this.ws.send(data.buffer)
  }

  recv(cb: (data: Uint8Array) => void, signal: AbortSignal): void {
    this.ws.addEventListener("message", (msg) => {
      if (!(msg.data instanceof ArrayBuffer)) return
      cb(new Uint8Array(msg.data))
    }, { signal })
  }
}

export function serveScald<T>(
  $api: $.Codec<T>,
  api: T,
  connection: Link,
  signal: AbortSignal,
) {
  const scald = new Scald(connection, signal)
  scald.expose(() => scald.encode($api, api))
}

export async function connectScald<T>(
  $api: $.Codec<T>,
  connection: Link,
  signal: AbortSignal,
): Promise<T> {
  const scald = new Scald(connection, signal)
  const data = await scald.call(0, new Uint8Array())
  return scald.decode($api, data)
}
