import { FrameContext } from "/codegen/frame/Context.ts";
import { Type } from "/codegen/frame/Type.ts";
import { TypeDecoder } from "/codegen/frame/TypeDecoder.ts";
import { SourceFile } from "/codegen/SourceFile.ts";
import { Config } from "/config/mod.ts";
import { WebSocketConnectionPool } from "/connection/mod.ts";
import * as frame from "/frame/mod.ts";
import * as s from "/system/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

// TODO: make this compatible with string lists & chain specs
export async function* FrameChainSourceFileIter(
  config: Config,
  chainAlias: string,
  beacon: string,
): AsyncGenerator<ts.SourceFile, void, void> {
  const fiber = new s.Fiber(frame.Metadata(s.Resource.ProxyWebSocketUrl(s.lift(beacon))));
  const result = await fiber.run({ connections: new WebSocketConnectionPool() });
  asserts.assert(!(result instanceof Error));
  const metadata = result.value;

  const context = new FrameContext(config, chainAlias, beacon, metadata);

  const typeDescriptors = Object.values(context.typeDescriptorByI);
  for (let i = 0; i < typeDescriptors.length; i++) {
    const typeDescriptor = typeDescriptors[i]!;

    const typeDeclarationStatements = new Type(context, typeDescriptor).digest();
    const typeDecoder = new TypeDecoder(context, typeDescriptor).digest();

    yield SourceFile(typeDescriptor.sourceFilePath, [
      ...typeDescriptor.importDeclarations,
      ...typeDeclarationStatements,
      typeDecoder,
    ]);
  }
}
