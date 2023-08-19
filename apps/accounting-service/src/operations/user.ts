import {CUD_EVENT, IBrokerEvent} from "popug-schemas";
import {User} from "../schemas/user";
import {IProcessMessage} from "./types";

export const processMessage: IProcessMessage = (message) => {
  const value: IBrokerEvent = JSON.parse((message as any).value);

  switch (value.type) {
    case CUD_EVENT.USER_CREATED:
      return User.create({...value.data})

    default:
      return
  }
}
