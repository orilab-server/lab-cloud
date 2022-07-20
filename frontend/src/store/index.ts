import { atom } from "recoil";

export const pathState = atom<string>({
  key: "pathState",
  default: "",
});

type NotifyType = {
  severity: "info" | "error";
  text: string;
};

export const notifyState = atom<NotifyType | null>({
  key: "notifyState",
  default: null,
});

export const userNameState = atom<string | null>({
  key: "userNameState",
  default: null,
});
