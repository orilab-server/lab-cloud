import { atom } from "recoil";

export const pathState = atom<string>({
  key: "pathState",
  default: "",
});

export const notifyState = atom<string>({
  key: "notifyState",
  default: "",
});
