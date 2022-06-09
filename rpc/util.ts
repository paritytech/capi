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
