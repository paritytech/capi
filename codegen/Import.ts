import { VERSION } from "/_/constants/version.ts";
import { f } from "/codegen/common.ts";
import { Config } from "/config/mod.ts";
import * as path from "std/path/mod.ts";
import ts from "typescript";

export const CapiImportSpecifier = (
  config: Config,
  sourceFileDir: string,
  subpaths: string[],
) => {
  const subpathsJoined = subpaths.join("/");
  switch (config.raw.target.capi) {
    case "denoland_x": {
      return `https://deno.land/x/capi@${VERSION}/${subpathsJoined}.ts`;
    }
    case "npm": {
      return `capi/${subpathsJoined}`;
    }
    default: {
      return [
        path.relative(
          sourceFileDir,
          path.join(config.baseDirAbs, config.raw.target.capi.vendored),
        ).split(path.sep).join("/"),
        subpaths.join("/").concat(".ts"),
      ].join("/");
    }
  }
};

export const NamespacedImport = (
  name: ts.Identifier,
  moduleSpecifierText: string,
) => {
  return f.createImportDeclaration(
    undefined,
    undefined,
    f.createImportClause(
      false,
      undefined,
      f.createNamespaceImport(name),
    ),
    f.createStringLiteral(moduleSpecifierText),
    undefined,
  );
};

export const NamedImport = (
  name: ts.Identifier,
  moduleSpecifierText: string,
) => {
  return f.createImportDeclaration(
    undefined,
    undefined,
    f.createImportClause(
      false,
      undefined,
      f.createNamedImports([f.createImportSpecifier(
        false,
        undefined,
        name,
      )]),
    ),
    f.createStringLiteral(moduleSpecifierText),
    undefined,
  );
};
