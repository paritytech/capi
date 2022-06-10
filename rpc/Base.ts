import { deferred } from "../_deps/async.ts";
import * as M from "./messages.ts";
import { IsCorrespondingRes } from "./util.ts";

export type ListenerCb<IngressMessage_ extends M.IngressMessage = M.IngressMessage> = (
  ingressMessage: IngressMessage_,
) => void;

export type StopListening = () => void;

export class RpcError extends Error {
  constructor(readonly inner: M.ErrMessage) {
    super();
  }
}

export abstract class RpcClient {
  abstract send: (egressMessage: M.InitMessage) => void;
  abstract listen: (listenerCb: ListenerCb) => StopListening;
  abstract close: () => Promise<void>;

  #nextId = 0;

  uid = (): string => {
    return (this.#nextId++).toString();
  };

  call = async <Method extends M.MethodName>(
    method: Method,
    params: M.InitMessageByMethodName[Method]["params"],
  ): Promise<M.OkMessage<Method> | RpcError> => {
    const init: M.InitMessage = {
      jsonrpc: "2.0",
      id: this.uid(),
      method: method as any,
      params,
    };
    const isCorrespondingRes = IsCorrespondingRes(init);
    const pending = deferred<M.OkMessage<Method> | RpcError>();
    const stopListening = this.listen((res) => {
      if (isCorrespondingRes(res)) {
        if (res.error) {
          pending.resolve(new RpcError(res));
        } else {
          pending.resolve(res as any /* TODO: get typings to behave */);
        }
      }
    });
    this.send(init);
    const result = await pending;
    stopListening();
    return result;
  };

  subscribe = async <Method extends M.SubscriptionMethodName>(
    method: Method,
    params: M.InitMessage<Method>["params"],
    listenerCb: ListenerCb<M.NotifMessage<Method>>,
  ): Promise<StopListening> => {
    const initRes = await this.call(method, params);
    if (initRes instanceof RpcError) {
      throw initRes;
    }
    const stopListening = this.listen((res) => {
      if (res.params?.subscription === initRes.result) {
        listenerCb(res as M.NotifMessage<Method>);
      }
    });
    return stopListening;
  };
}

export type RpcClientFactory<Beacon> = (beacon: Beacon) => Promise<RpcClient>;
