import * as a from "std/async/mod.ts";
import { ListenerCb, RpcClient, StopListening } from "./Base.ts";
import * as t from "./messages/types.ts";

export const isRes = <InQuestion extends t.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<t.Res, InQuestion> => {
  return "id" in inQuestion;
};

export const isNotif = <InQuestion extends t.IngressMessage>(
  inQuestion: InQuestion,
): inQuestion is Extract<InQuestion, t.Notif> => {
  return "params" in inQuestion && "subscription" in inQuestion.params;
};

export const IsCorrespondingRes = <Init_ extends t.Init>(init: Init_) => {
  return <InQuestion extends t.IngressMessage>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<InQuestion, t.ResByName[Init_["method"]]> => {
    return isRes(inQuestion) && inQuestion.id === init.id;
  };
};

// export const IsCorrespondingNotif = <Init_ extends SubscriptionInit>(init: Init_) => {
//   return <InQuestion extends IngressMessage>(
//     inQuestion: InQuestion,
//   ): inQuestion is Extract<InQuestion, NotifByName[Init_["method"]]> => {
//     // TODO: why not narrowing?
//     // @ts-ignore
//     return isNotif(inQuestion) && inQuestion.params.subscription === init.id;
//   };
// };

export const call = async <Method extends t.MethodName>(
  client: RpcClient,
  method: Method,
  params: t.InitByName[Method]["params"],
): Promise<t.ResByName[Method]> => {
  const init: t.Init = {
    jsonrpc: "2.0",
    id: client.uid(),
    method,
    params: params as any,
  };
  const isCorrespondingRes = IsCorrespondingRes(init);
  const pending = a.deferred<t.ResByName[Method]>();
  const stopListening = client.listen(async (res) => {
    if (isCorrespondingRes(res)) {
      pending.resolve(res as t.ResByName[Method]);
    }
  });
  client.send(init);
  const result = await pending;
  stopListening();
  return result;
};

export const subscribe = async <Method extends t.SubscriptionMethodName>(
  client: RpcClient,
  method: Method,
  params: t.InitByName[Method]["params"],
  listenerCb: ListenerCb<t.NotifByName[Method]>,
): Promise<StopListening> => {
  const init: t.Init = {
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
      id = (res as t.ResByName[Method]).result as string;
    } else {
      // @ts-ignore
      if (isNotif(res) && res.params.subscription === id) {
        listenerCb(res as t.NotifByName[Method]);
      }
    }
  });
  client.send(init);
  return stopListening;
};
