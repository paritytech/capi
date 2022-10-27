export class ProviderHandlerError<Inner> extends Error {
  override readonly name = "ProviderInternalError";
  constructor(readonly inner: Inner) {
    super();
  }
}

export class ProviderSendError<Inner> extends Error {
  override readonly name = "ProviderSendError";
  constructor(readonly inner: Inner) {
    super();
  }
}

export class ProviderCloseError<Inner> extends Error {
  override readonly name = "ProviderCloseError";
  constructor(readonly inner: Inner) {
    super();
  }
}
