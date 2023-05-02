export async function exportParachainGenesis(binary: string, chain: string, signal: AbortSignal) {
  return await Promise.all(["state", "wasm"].map(async (type) => {
    const { success, stdout } = await new Deno.Command(binary, {
      args: [`export-genesis-${type}`, "--chain", chain],
      signal,
    }).output()
    // TODO: improve error message
    if (!success) throw new Error(`export-genesis-${type} failed`)
    return new TextDecoder().decode(stdout)
  })) satisfies string[] as [state: string, wasm: string]
}
