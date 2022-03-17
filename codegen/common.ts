import { Config } from "/config/mod.ts";
import ts from "typescript";

export const f = ts.factory;

export type Factory<T extends ts.Node | ts.Node[]> = (config: Config) => T;
export type AnyFactory = Factory<ts.Node | ts.Node[]>;

export const newLine: ts.Statement = f.createIdentifier("\n") as any;

// TODO: fine-tune treatment of whitespace
export const comment = (target: ts.Statement | ts.PropertySignature, commentText: string): void => {
  ts.addSyntheticLeadingComment(
    target,
    ts.SyntaxKind.MultiLineCommentTrivia,
    `* ${commentText}`,
    true,
  );
};
