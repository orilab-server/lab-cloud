import { atom } from "recoil";

export const pathState = atom<string>({
  key: "pathState",
  default: "",
});

type NotifyType = {
  severity: "info" | "error";
  text: string;
};

export const sessionState = atom<string | null>({
  key: "sessionState",
  default: null,
});

export const notifyState = atom<NotifyType | null>({
  key: "notifyState",
  default: null,
});

export const userNameState = atom<string | null>({
  key: "userNameState",
  default: null,
});

export const isTemporaryState = atom<boolean>({
  key: "isTemporaryState",
  default: true,
});

export const topDirsState = atom<string[]>({
  key: "topDirsState",
  default: [],
});
