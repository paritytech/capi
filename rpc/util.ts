import * as U from "/util/mod.ts";
import * as A from "std/async/mod.ts";
import { ListenerCb, RpcClient, StopListening } from "./Base.ts";
import * as M from "./messages.ts";

export const IsCorrespondingRes = <Init_ extends M.InitMessage>(init: Init_) => {
  return <InQuestion extends M.IngressMessage>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<InQuestion, M.OkMessageByMethodName[Init_["method"]] | M.ErrMessage> => {
    if (inQuestion.error || inQuestion.result) {
      inQuestion;
    }
    return inQuestion?.id === init.id;
  };
};

export const call = async <Method extends M.MethodName>(
  client: RpcClient,
  method: Method,
  params: M.InitMessageByMethodName[Method]["params"],
): Promise<U.Flatten<M.OkMessageByMethodName[Method] | M.ErrMessage>> => {
  const init: M.InitMessage = {
    jsonrpc: "2.0",
    id: client.uid(),
    method: method as any,
    params,
  };
  const isCorrespondingRes = IsCorrespondingRes(init);
  const pending = A.deferred<M.OkMessageByMethodName[Method]>();
  const stopListening = client.listen(async (res) => {
    if (isCorrespondingRes(res)) {
      pending.resolve(res as M.OkMessageByMethodName[Method]);
    }
  });
  client.send(init);
  const result = await pending;
  stopListening();
  return result as any;
};

export const subscribe = async <Method extends M.SubscriptionMethodName>(
  client: RpcClient,
  method: Method,
  params: M.InitMessageByMethodName[Method]["params"],
  listenerCb: ListenerCb<M.NotifByMethodName[Method]>,
): Promise<StopListening> => {
  const initRes = await call(client, method, params);
  if (initRes.error) {
    throw new Error(); // TODO
  }
  const stopListening = client.listen(async (res) => {
    if (res.params?.subscription === initRes.result) {
      listenerCb(res as M.NotifByMethodName[Method]);
    }
  });
  return stopListening;
};
