import { hex } from "../crypto/mod.ts"
import { WsConnection } from "../rpc/mod.ts"
import { getFreePort, portReady } from "../util/port.ts"
import { withSignal } from "../util/withSignal.ts"
import { resolveBinary } from "./binary.ts"
import { BinaryChain } from "./mod.ts"

export async function getBinaryMetadata({ binary, chain }: BinaryChain, signal: AbortSignal) {
  const bin = await resolveBinary(binary, signal)
  const port = getFreePort()
  return await withSignal(async (signal) => {
    console.error("starting", bin, chain)
    new Deno.Command(bin, {
      args: ["--chain", chain, "--ws-port", `${port}`],
      stdin: "null",
      stdout: "piped",
      stderr: "piped",
      signal,
    }).spawn()
    await portReady(port)
    console.error(bin, chain, "ready on", port)
    return await getUrlMetadata({ url: `ws://localhost:${port}` }, signal)
  }, signal)
}

export async function getUrlMetadata({ url }: { url: string }, signal: AbortSignal) {
  return await withSignal(async (signal) => {
    console.error("connecting to", url)
    const connection = WsConnection.connect(url, signal)
    const response = await connection.call("state_getMetadata", [])
    if (response.error) throw new Error("Error getting metadata")
    console.error("got metadata from", url)
    return hex.decode(response.result as string)
  }, signal)
}
