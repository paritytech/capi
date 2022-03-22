import ts from "typescript";

export const f = ts.factory;

export const newLine: ts.Statement = f.createIdentifier("\n") as any;

// TODO: fine-tune treatment of whitespace
export const comment = (target: ts.Statement | ts.PropertySignature, commentText: string): void => {
  ts.addSyntheticLeadingComment(target, ts.SyntaxKind.MultiLineCommentTrivia, `* ${commentText}`, true);
};

export const scaleDecodeNamespaceIdent = f.createUniqueName("d");

export const placeholderFn = f.createArrowFunction(
  undefined,
  undefined,
  [],
  undefined,
  f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
  f.createBlock(
    [
      f.createIfStatement(
        f.createAsExpression(
          f.createTrue(),
          f.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
        ),
        f.createBlock(
          [f.createThrowStatement(f.createNewExpression(
            f.createIdentifier("Error"),
            undefined,
            [],
          ))],
          true,
        ),
        undefined,
      ),
      f.createReturnStatement(f.createAsExpression(
        f.createIdentifier("undefined"),
        f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
      )),
    ],
    true,
  ),
);

export const PropertySignature = (
  key: string,
  type: ts.TypeReferenceNode | ts.LiteralTypeNode | ts.KeywordTypeNode | ts.TupleTypeNode | ts.ArrayTypeNode,
) => {
  return f.createPropertySignature(undefined, f.createIdentifier(key), undefined, type);
};
