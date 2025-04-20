import { IAuthState } from "../../interfaces/state";
import $global from "@/utils/global";
import { IUser } from "../../interfaces/user";

export default {
  user: (state: IAuthState): IUser => state.user,
  token: (state: IAuthState): string => state.token,
};
