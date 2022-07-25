export function mapListener<T, U>(
  createListenerCb: CreateListenerCb<U>,
  map: (message: T) => U,
): CreateListenerCb<T> {
  return (close) => {
    const inner = createListenerCb(close);
    return (message) => {
      inner(map(message));
    };
  };
}

export type CreateListenerCb<IngressMessage> = (
  stop: DestroyListener,
) => ListenerCb<IngressMessage>;
export type DestroyListener = () => void;
export type ListenerCb<IngressMessage> = (ingressMessage: IngressMessage) => void;
