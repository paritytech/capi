import { codecs } from "./codecs.ts"
import { CodegenCtx, CodegenCtxProps } from "./Ctx.ts"
import { extrinsic } from "./extrinsic.ts"
import { pallet } from "./pallet.ts"
import { type } from "./type.ts"
import { createTypeVisitor } from "./typeVisitor.ts"

export function codegen(props: CodegenCtxProps): CodegenCtx {
  const ctx = new CodegenCtx(props)
  const typeVisitor = createTypeVisitor(ctx)
  for (const [path, typeFile] of ctx.typeFiles) {
    const filePath = path + typeFile.ext
    ctx.files.set(filePath, type(ctx, typeVisitor, path, filePath, typeFile))
  }
  ctx.files.set("_/codecs.ts", codecs(ctx, typeVisitor))
  ctx.files.set("_/capi.ts", `export * from "${ctx.importSpecifier(props.capiMod)}"`)
  ctx.files.set("_/client.ts", `export * from "${ctx.importSpecifier(props.clientMod)}"`)
  ctx.files.set("_/extrinsic.ts", extrinsic(ctx, typeVisitor))
  ctx.files.set("mod.ts", `export * from "./_/extrinsic.ts"`)
  for (const p of props.metadata.pallets) {
    if (!p.calls && !p.constants.length && !p.storage?.entries.length) continue
    ctx.files.set(`${p.name}.ts`, pallet(p, typeVisitor))
  }
  return ctx
}
