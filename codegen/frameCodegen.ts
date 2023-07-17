import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { FrameMetadata } from "../frame_metadata/mod.ts"
import { CodecCodegen } from "./CodecCodegen.ts"
import { formatDocComment } from "./common.ts"
import { TypeCodegen } from "./TypeCodegen.ts"

export function frameCodegen(
  metadata: FrameMetadata,
  chainIdent: string,
  files: Map<string, string>,
) {
  const codecCodegen = new CodecCodegen()
  codecCodegen.visit(metadata)
  codecCodegen.write(files)

  const typeCodegen = new TypeCodegen(codecCodegen, metadata.types)
  typeCodegen.write(files)

  files.set("mod.d.ts", mod)
  files.set("mod.js", mod)

  files.set(
    "metadata.d.ts",
    `
      ${importsCommon}
      export const metadata: ${typeCodegen.print(metadata)}
    `,
  )
  files.set(
    "metadata.js",
    `
      ${importsCommon}
      export const metadata = ${codecCodegen.print(metadata)}
    `,
  )

  const chainMemberDeclarations: string[] = []
  const chainMembers: string[] = []
  const palletDeclarations: string[] = []
  const palletDefinitions: string[] = []

  const chainRuneIdent = `${chainIdent}Rune`

  for (const pallet of Object.values(metadata.pallets)) {
    const palletRuneIdent = `${chainIdent}${pallet.name}Rune`
    chainMemberDeclarations.push(`${pallet.name}: ${palletRuneIdent}<U>`)
    chainMembers.push(
      `${pallet.name} = this.pallet("${pallet.name}").into(${palletRuneIdent}, this)`,
    )

    const palletDeclarationStatements: string[] = []
    const palletStatements: string[] = []

    for (const storage of Object.values(pallet.storage)) {
      palletDeclarationStatements.push(`
        ${formatDocComment(storage.docs)}
        ${storage.name}: C.StorageRune<${chainIdent}, "${pallet.name}", "${storage.name}", never>
      `)
      palletStatements.push(`${storage.name} = this.storage("${storage.name}")`)
    }

    for (const constant of Object.values(pallet.constants)) {
      palletDeclarationStatements.push(`
        ${formatDocComment(constant.docs)}
        ${constant.name}: ${typeCodegen.native(constant.codec)}
      `)
      palletStatements.push(
        `${constant.name} = ${codecCodegen.print(constant.codec)}.decode(C.hex.decode("${
          hex.encode(constant.value)
        }"))`,
      )
    }

    const { call } = pallet.types
    if (call) {
      const factory = typeCodegen.typeNames.get(call)!
      new $.CodecVisitor<void>()
        .add(
          $.taggedUnion,
          (_codec, _tagKey: string, variantsRaw) =>
            (Array.isArray(variantsRaw) ? variantsRaw : Object.values(variantsRaw)).forEach(
              (variant) => {
                palletDeclarationStatements.push(
                  `
                    ${variant.tag}: <X>(
                      props: C.RunicArgs<X, Omit<${factory}.${variant.tag}, "type">>
                    ) => C.ExtrinsicRune<${chainIdent}, C.RunicArgs.U<X>>
                  `,
                )
                palletStatements.push(extrinsicFactory(variant.tag, true))
              },
            ),
        )
        .add($.literalUnion<unknown>, (_, values) =>
          Object.values(values).forEach((value) => {
            if (typeof value !== "string") {
              throw new Error("pallet call non-string literalUnion is unsupported")
            }
            palletDeclarationStatements.push(
              `${value}: () => C.ExtrinsicRune<${chainIdent}, never>`,
            )
            palletStatements.push(extrinsicFactory(value, false))
          }))
        .add($.never, () => {})
        .visit(call)

      // deno-lint-ignore no-inner-declarations
      function extrinsicFactory(methodIdent: string, args: boolean) {
        return `
          ${methodIdent} = (${args ? "...args" : ""}) => this.chain.extrinsic(C.Rune.object({
            type: "${pallet.name}",
            value: ${factory}.${methodIdent}${args ? "(...args)" : ""},
          }))
        `
      }
    }

    palletDeclarations.push(`
      export class ${palletRuneIdent}<out U> extends C.PalletRune<${chainIdent}, "${pallet.name}", U> {
        ${palletDeclarationStatements.join("\n")}
      }
    `)
    palletDefinitions.push(`
      export class ${palletRuneIdent} extends C.PalletRune {
        ${palletStatements.join("\n")}
      }
    `)
  }

  files.set(
    "chain.d.ts",
    `
      ${importsCommon}
      import { metadata } from "./metadata.js"

      export interface ${chainIdent} extends C.Chain<typeof metadata> {}

      export class ${chainRuneIdent}<out U> extends C.ChainRune<${chainIdent}, U> {
        static override from(connect: (signal: AbortSignal) => C.Connection): ${chainRuneIdent}<never>

        override with(connection: (signal: AbortSignal) => C.Connection): ${chainRuneIdent}<U>

        ${chainMemberDeclarations.join("\n")}
      }

      ${palletDeclarations.join("\n")}
    `,
  )

  files.set(
    "chain.js",
    `
      ${importsCommon}
      import { metadata } from "./metadata.js"

      export class ${chainRuneIdent} extends C.ChainRune {
        static from(connect) {
          return super.from(connect, metadata)
        }

        with(connect) {
          return super.with(connect).into(${chainRuneIdent})
        }

        ${chainMembers.join("\n")}
      }

      ${palletDefinitions.join("\n")}
    `,
  )
}

const mod = `
  export * from "./chain.js"
  export * from "./connection.js"
  export * from "./metadata.js"
  export * from "./types.js"
`

const importsCommon = `
  import * as _codecs from "./codecs.js"
  import * as C from "./capi.js"
  import * as t from "./types.js"
`
