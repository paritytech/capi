export type CreateListenerCb<IngressMessage> = (
  stop: DestroyListener,
) => ListenerCb<IngressMessage>;
export type DestroyListener = () => void;
export type ListenerCb<IngressMessage> = (ingressMessage: IngressMessage) => void;

export function mapCreateListenerCb<From, Into>(
  createListenerCb: CreateListenerCb<Into>,
  map: (message: From) => Into,
): CreateListenerCb<From> {
  return (close) => {
    const listenerCb = createListenerCb(close);
    return (message) => {
      listenerCb(map(message));
    };
  };
}
