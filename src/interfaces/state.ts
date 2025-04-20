import { IUser } from "./user";
export interface IAuthState {
  token: string;
  user: IUser;
  aesKey: CryptoKey;
}

export interface IAuthModule {
  namespaced: boolean;
  state: IAuthState;
  actions: any;
  getters: any;
}
