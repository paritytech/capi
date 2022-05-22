import * as u from "/util/mod.ts";
import * as a from "std/async/mod.ts";
import { ListenerCb, RpcClient, StopListening } from "./Base.ts";
import * as m from "./messages.ts";

export const isOkRes = <InQuestion extends m.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<m.OkRes, InQuestion> => {
  return "id" in inQuestion;
};

export const isErrRes = (inQuestion: m.IngressMessage): inQuestion is m.ErrRes => {
  return "error" in inQuestion;
};

export const isNotif = <InQuestion extends m.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<InQuestion, m.Notif> => {
  return "params" in inQuestion && "subscription" in inQuestion.params;
};

export const IsCorrespondingRes = <Init_ extends m.Init>(init: Init_) => {
  return <InQuestion extends m.IngressMessage>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<InQuestion, m.OkResByName[Init_["method"]] | m.ErrRes> => {
    return (isOkRes(inQuestion) || isErrRes(inQuestion)) && inQuestion.id === init.id;
  };
};

export const call = async <Method extends m.Name>(
  client: RpcClient,
  method: Method,
  params: m.InitByName[Method]["params"],
): Promise<u.Flatten<m.OkResByName[Method] | m.ErrRes>> => {
  const init: m.Init = {
    jsonrpc: "2.0",
    id: client.uid(),
    method: method as any,
    params,
  };
  const isCorrespondingRes = IsCorrespondingRes(init);
  const pending = a.deferred<m.OkResByName[Method]>();
  const stopListening = client.listen(async (res) => {
    if (isCorrespondingRes(res)) {
      pending.resolve(res as m.OkResByName[Method]);
    }
  });
  client.send(init);
  const result = await pending;
  stopListening();
  return result as any;
};

export const subscribe = async <Method extends m.SubscriptionName>(
  client: RpcClient,
  method: Method,
  params: m.InitByName[Method]["params"],
  listenerCb: ListenerCb<m.NotifByName[Method]>,
): Promise<StopListening> => {
  const initRes = await call(client, method, params);
  if (isErrRes(initRes)) {
    throw new Error(); // TODO
  }
  const stopListening = client.listen(async (res) => {
    if (isNotif(res) && res.params.subscription === initRes.result) {
      listenerCb(res as m.NotifByName[Method]);
    }
  });
  return stopListening;
};
