import { atom } from "recoil";

export const loggedInState = atom({
  key: 'loggedIn',
  default: false
});

export const isLoadingState = atom({
  key: 'isLoading',
  default: false
})

export const name = atom({
  key: 'name',
  default: ""
})

export const email = atom({
  key: "email",
  default: ""
})

export const picture = atom({
  key: "picture",
  default: ""
})

export const userId = atom({
  key: "userId",
  default: ""
})

export const backendUrl = atom({
  key: "backendUrl",
  default: "http://localhost:3001/"

})