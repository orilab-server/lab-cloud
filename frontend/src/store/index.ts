import { atom } from "recoil";

export const pathState = atom<string>({
  key: "pathState",
  default: "",
});
