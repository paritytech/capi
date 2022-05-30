import * as U from "/util/mod.ts";
import * as A from "std/async/mod.ts";
import { ListenerCb, RpcClient, StopListening } from "./Base.ts";
import * as M from "./messages.ts";

export const isOkRes = <InQuestion extends M.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<M.OkRes, InQuestion> => {
  return "id" in inQuestion;
};

export const isErrRes = (inQuestion: M.IngressMessage): inQuestion is M.ErrRes => {
  return "error" in inQuestion;
};

export const isNotif = <InQuestion extends M.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<InQuestion, M.Notif> => {
  return "params" in inQuestion && "subscription" in inQuestion.params;
};

export const IsCorrespondingRes = <Init_ extends M.Init>(init: Init_) => {
  return <InQuestion extends M.IngressMessage>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<InQuestion, M.OkResByName[Init_["method"]] | M.ErrRes> => {
    return (isOkRes(inQuestion) || isErrRes(inQuestion)) && inQuestion.id === init.id;
  };
};

export const call = async <Method extends M.Name>(
  client: RpcClient,
  method: Method,
  params: M.InitByName[Method]["params"],
): Promise<U.Flatten<M.OkResByName[Method] | M.ErrRes>> => {
  const init: M.Init = {
    jsonrpc: "2.0",
    id: client.uid(),
    method: method as any,
    params,
  };
  const isCorrespondingRes = IsCorrespondingRes(init);
  const pending = A.deferred<M.OkResByName[Method]>();
  const stopListening = client.listen(async (res) => {
    if (isCorrespondingRes(res)) {
      pending.resolve(res as M.OkResByName[Method]);
    }
  });
  client.send(init);
  const result = await pending;
  stopListening();
  return result as any;
};

export const subscribe = async <Method extends M.SubscriptionName>(
  client: RpcClient,
  method: Method,
  params: M.InitByName[Method]["params"],
  listenerCb: ListenerCb<M.NotifByName[Method]>,
): Promise<StopListening> => {
  const initRes = await call(client, method, params);
  if (isErrRes(initRes)) {
    throw new Error(); // TODO
  }
  const stopListening = client.listen(async (res) => {
    if (isNotif(res) && res.params.subscription === initRes.result) {
      listenerCb(res as M.NotifByName[Method]);
    }
  });
  return stopListening;
};
