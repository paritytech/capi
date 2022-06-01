export enum ParseErrorKind {
  JsonRpcParse,
  UnknownNotification,
  Method,
}

export enum MethodErrorKind {
  UnknownMethod,
  InvalidParametersFormat,
  TooManyParameters,
  InvalidParameters,
}
