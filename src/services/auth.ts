/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { Gatekeeper } from 'gatekeeper-client-sdk';
import auth from "./api/auth/auth";
const authAPI = new auth();

const getError = (error: any) => {
  const message = error.message || "Failed";
  return new Error(message);
};

export const loginByAuth = async (
  email: string,
  password: string,
  shift: string
) => {
  try {
    const token = await authAPI.login(email, password, shift);
    return token;
  } catch (error: any) {
    throw new Error(error);
  }
};

// export const registerByAuth = async (email: string, password: string) => {
//     try {
//         const token = await Gatekeeper.registerByAuth(email, password);
//         return token;
//     } catch (error: any) {
//         throw getError(error);
//     }
// };

// export const loginByGoogle = async () => {
//     try {
//         const token = await Gatekeeper.loginByGoogle();
//         return token;
//     } catch (error: any) {
//         throw getError(error);
//     }
// };

// export const registerByGoogle = async () => {
//     try {
//         const token = await Gatekeeper.registerByGoogle();
//         return token;
//     } catch (error: any) {
//         throw getError(error);
//     }
// };

// export const loginByFacebook = async () => {
//     try {
//         const token = await Gatekeeper.loginByFacebook();
//         return token;
//     } catch (error: any) {
//         throw getError(error);
//     }
// };

// export const registerByFacebook = async () => {
//     try {
//         const token = await Gatekeeper.registerByFacebook();
//         return token;
//     } catch (error: any) {
//         throw getError(error);
//     }
// };
// export const getProfile = async () => {
//     try {
//         const user = await Gatekeeper.getProfile();
//         return user;
//     } catch (error: any) {
//         throw getError(error);
//     }
// };
