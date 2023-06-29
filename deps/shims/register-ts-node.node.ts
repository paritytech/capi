export async function register() {
  // @ts-ignore Exposed by deps/shims/loader.node.ts
  await globalThis.__capi_enableTsLoader()
}
