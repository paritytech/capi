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
