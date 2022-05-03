import * as a from "std/async/mod.ts";
import { ListenerCb, RpcClient, StopListening } from "./Base.ts";
import * as m from "./messages.ts";

export const isRes = <InQuestion extends m.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<m.Res, InQuestion> => {
  return "id" in inQuestion;
};

export const isNotif = <InQuestion extends m.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<InQuestion, m.Notif> => {
  return "params" in inQuestion && "subscription" in inQuestion.params;
};

export const IsCorrespondingRes = <Init_ extends m.Init>(init: Init_) => {
  return <InQuestion extends m.IngressMessage>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<InQuestion, m.ResByName[Init_["method"]]> => {
    return isRes(inQuestion) && inQuestion.id === init.id;
  };
};

export const call = async <Method extends m.Name>(
  client: RpcClient,
  method: Method,
  params: m.InitByName[Method]["params"],
): Promise<m.ResByName[Method]> => {
  const init: m.Init = {
    jsonrpc: "2.0",
    id: client.uid(),
    method,
    params: params as any,
  };
  const isCorrespondingRes = IsCorrespondingRes(init);
  const pending = a.deferred<m.ResByName[Method]>();
  const stopListening = client.listen(async (res) => {
    if (isCorrespondingRes(res)) {
      pending.resolve(res as m.ResByName[Method]);
    }
  });
  client.send(init);
  const result = await pending;
  stopListening();
  return result;
};

export const subscribe = async <Method extends m.SubscriptionName>(
  client: RpcClient,
  method: Method,
  params: m.InitByName[Method]["params"],
  listenerCb: ListenerCb<m.NotifByName[Method]>,
): Promise<StopListening> => {
  const init: m.Init = {
    jsonrpc: "2.0",
    id: client.uid(),
    method,
    params: params as any,
  };
  const isCorrespondingRes = IsCorrespondingRes(init);
  let id: string | undefined;
  const stopListening = client.listen(async (res) => {
    if (isCorrespondingRes(res)) {
      // TODO
      id = (res as m.ResByName[Method]).result as string;
    } else {
      // @ts-ignore
      if (isNotif(res) && res.params.subscription === id) {
        listenerCb(res as m.NotifByName[Method]);
      }
    }
  });
  client.send(init);
  return stopListening;
};
