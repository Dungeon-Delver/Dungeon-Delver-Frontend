import { atom } from "recoil";

export const loggedInState = atom({
  key: "loggedIn",
  default: false,
});

export const isLoggingInState = atom({
  key: "isLoading",
  default: false,
});

export const currentUser = atom({
  key: "currentUser",
  default: null,
});

export const navbarOpen = atom({
  key: "navbarOpen",
  default: false,
});
