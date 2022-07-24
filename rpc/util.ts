import { ProviderMethods } from "./common.ts";
import * as msg from "./messages.ts";

export function IsCorrespondingRes<
  M extends ProviderMethods,
  Init_ extends msg.InitMessage<M>,
>(init: Init_) {
  return <InQuestion extends msg.IngressMessage<M>>(
    inQuestion: InQuestion,
  ): inQuestion is Extract<
    InQuestion,
    msg.OkMessageByMethodName<M>[Init_["method"]] | msg.ErrMessage
  > => {
    return inQuestion?.id === init.id;
  };
}
