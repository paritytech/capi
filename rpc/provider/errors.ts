export class ProviderSendError<Data> extends Error {
  override readonly name = "ProviderSendError";
  constructor(override readonly cause: Data) {
    super();
  }
}

export class ProviderHandlerError<Data> extends Error {
  override readonly name = "ProviderInternalError";
  constructor(override readonly cause: Data) {
    super();
  }
}

export class ProviderCloseError<Data> extends Error {
  override readonly name = "ProviderCloseError";
  constructor(override readonly cause: Data) {
    super();
  }
}
