import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { FrameMetadata } from "../frame_metadata/mod.ts"
import { CodecCodegen } from "./CodecCodegen.ts"
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

  files.set("mod.d.ts", MOD)
  files.set("mod.js", MOD)

  files.set(
    "metadata.d.ts",
    `
      ${IMPORTS_COMMON}
      export const metadata: metadata
      export type metadata = ${typeCodegen.print(metadata)}
    `,
  )
  files.set(
    "metadata.js",
    `
      ${IMPORTS_COMMON}
      export const metadata = ${codecCodegen.print(metadata)}
    `,
  )

  const chainMemberDeclarations: string[] = []
  const chainMembers: string[] = []
  const palletDeclarations: string[] = []
  const palletDefinitions: string[] = []

  for (const pallet of Object.values(metadata.pallets)) {
    chainMemberDeclarations.push(`${pallet.name}: ${pallet.name}PalletRune<U>`)
    chainMembers.push(
      `${pallet.name} = this.pallet("${pallet.name}").into(${pallet.name}PalletRune, this)`,
    )

    const palletDeclarationStatements: string[] = []
    const palletStatements: string[] = []

    for (const storage of Object.values(pallet.storage)) {
      palletDeclarationStatements.push(
        `${storage.name}: C.StorageRune<${chainIdent}, "${pallet.name}", "${storage.name}", never>`,
      )
      palletStatements.push(`${storage.name} = this.storage("${storage.name}")`)
    }

    for (const constant of Object.values(pallet.constants)) {
      palletDeclarationStatements.push(`${constant.name}: ${typeCodegen.native(constant.codec)}`)
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
                palletStatements.push(extrinsicFactory(variant.tag))
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
            palletStatements.push(extrinsicFactory(value))
          }))
        .add($.never, () => {})
        .visit(call)

      // deno-lint-ignore no-inner-declarations
      function extrinsicFactory(methodIdent: string) {
        return `
          ${methodIdent} = (...args) => this.chain.extrinsic(C.Rune.object({
            type: "${pallet.name}",
            value: ${factory}.${methodIdent}(...args),
          }))
        `
      }
    }

    palletDeclarations.push(`
      export class ${pallet.name}PalletRune<out U> extends C.PalletRune<${chainIdent}, "${pallet.name}", U> {
        ${palletDeclarationStatements.join("\n")}
      }
    `)
    palletDefinitions.push(`
      export class ${pallet.name}PalletRune extends C.PalletRune {
        ${palletStatements.join("\n")}
      }
    `)
  }

  files.set(
    "pallets.d.ts",
    `
      ${IMPORTS_COMMON}
      ${palletDeclarations.join("\n")}
    `,
  )
  files.set(
    "pallets.js",
    `
      ${IMPORTS_COMMON}
      ${palletDefinitions.join("\n")}
    `,
  )

  files.set(
    "chain.d.ts",
    `
      ${IMPORTS_COMMON}
      import { metadata } from "./metadata.js"

      export interface ${chainIdent} extends C.Chain<metadata> {}

      export class ${chainIdent}ChainRune<U> extends C.ChainRune<${chainIdent}, U> {
        static override from(connect: (signal: AbortSignal) => C.Connection): ${chainIdent}Rune

        ${chainMemberDeclarations.join("\n")}
      }

      ${palletDeclarations.join("\n")}

      export const chain: ${chainIdent}ChainRune<never>
    `,
  )

  files.set(
    "chain.js",
    `
      ${IMPORTS_COMMON}
      import { connect } from "./connection.js"
      import { metadata } from "./metadata.js"

      export class ${chainIdent}ChainRune extends C.ChainRune {
        static from(connect) {
          return super.from(connect, metadata)
        }

        ${chainMembers.join("\n")}
      }

      ${palletDefinitions.join("\n")}

      export const chain = ${chainIdent}ChainRune.from(connect)
    `,
  )
}

const MOD = `
  export * from "./chain.js"
  export * from "./connection.js"
  export * from "./metadata.js"
  export * from "./pallets.js"
  export * from "./types.js"
`

const IMPORTS_COMMON = `
  import * as _codecs from "./codecs.js"
  import * as C from "./capi.js"
  import * as t from "./types.js"
`
