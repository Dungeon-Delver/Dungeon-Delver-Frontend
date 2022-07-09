import { atom } from "recoil";

export const loggedInState = atom({
  key: 'loggedIn',
  default: false
});

export const isLoadingState = atom({
  key: 'isLoading',
  default: false
})

export const currentUser = atom({
  key: 'currentUser',
  default: null
})

export const backendUrl = atom({
  key: "backendUrl",
  default: "http://localhost:3001/"

})