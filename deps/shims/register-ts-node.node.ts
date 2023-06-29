export async function register() {
  await import(`ts-node/register`)
  // @ts-ignore Exposed by deps/shims/loader.node.ts
  await globalThis.__capi_enableTsLoader()
}
