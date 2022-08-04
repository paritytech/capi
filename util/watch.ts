import { Iter } from "./iter.ts";

export type WatchHandler<Event> = (event: Event) => void;
export type CreateWatchHandler<IngressMessage> = (stop: () => void) => WatchHandler<IngressMessage>;

export function mapCreateWatchHandler<From, Into>(
  createWatchHandler: CreateWatchHandler<Into>,
  map: (message: From) => Into,
): CreateWatchHandler<From> {
  return (close) => {
    const listenerCb = createWatchHandler(close);
    return (message) => {
      listenerCb(map(message));
    };
  };
}

export type Handle<T> = CreateWatchHandler<T> & { iter: Iter<T> };
export function handle<T>(): Handle<T> {
  const inner = new Iter<T>();
  const createWatchHandler: Handle<T> = (stop) => {
    inner.onDone = stop;
    return inner.push;
  };
  createWatchHandler.iter = inner;
  return createWatchHandler;
}
