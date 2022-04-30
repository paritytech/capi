import { Init, Notif, NotifByName, Res, ResByName, SubscriptionInit } from "./messages/types.ts";

export const IsCorrespondingRes = <Init_ extends Init>(init: Init_) => {
  return (inQuestion: Res | Notif): inQuestion is ResByName[Init_["method"]] => {
    return !!("id" in inQuestion && inQuestion.id === init.id);
  };
};

export const IsCorrespondingNotif = <Init_ extends SubscriptionInit>(init: Init_) => {
  return (inQuestion: Res | Notif): inQuestion is NotifByName[Init_["method"]] => {
    return !!("params" in inQuestion && "subscription" in inQuestion.params
      && inQuestion.params.subscription === init.id);
  };
};
