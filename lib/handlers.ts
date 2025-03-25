import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AxiosError } from "axios";
import { AuthError } from "next-auth";

export enum ERRORRES {
  INVALID_CREDENTIALS,
  ACCESS_DENIED,
  ALREADY_EXIST,
  BAD_REQUEST,
  GATE_TIMEOUT,
  UNAUTHORIZED,
  UNAVAILABLE,
  NOT_FOUND,
  FORBIDDEN,
  NETWORK,
  UNKNOWN,
  TIMEOUT,
  SERVER,
}

export const errorHandler = (error: unknown) => {
  let err = ERRORRES.SERVER;
  let msg = "Something went wrong";

  if (error instanceof AxiosError) {
    msg = error.message;

    switch (error.status) {
      case 401:
        err = ERRORRES.UNAUTHORIZED;
        msg = "You are not authenticated";
        break;
      case 403:
        err = ERRORRES.FORBIDDEN;
        msg = "You are not authorized to access this service";
        break;
      case 404:
        err = ERRORRES.NOT_FOUND;
        msg = "The record you are trying to access could not be found";
        break;
      case 408:
        err = ERRORRES.TIMEOUT;
        msg = "The action wasn't completed, please try again";
        break;
      case 503:
        err = ERRORRES.UNAVAILABLE;
        msg = "The server is currently down or unavailable";
        break;
      case 504:
        err = ERRORRES.GATE_TIMEOUT;
        msg =
          "The action could not be completed. Please check your Internet Connection";
        break;

      default:
        if (error.status) {
          if (error.status < 500) err = ERRORRES.BAD_REQUEST;
          if (error.status >= 500) err = ERRORRES.SERVER;
        }
        break;
    }
  }

  if ((error as any).name === "PrismaClientKnownRequestError") {
    switch ((error as any).code ?? '') {
      case "P5010":
        err = ERRORRES.NETWORK;
        msg =
          "Request failed, Please check your network connection and try again.";
        break;

      default:
        err = ERRORRES.UNKNOWN;
        break;
    }
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2001":
        err = ERRORRES.NOT_FOUND;
        msg = "The record you are looking for was not found";
        break;
      case "P2002":
        err = ERRORRES.ALREADY_EXIST;
        msg = "This record already exists";
        break;

      default:
        err = ERRORRES.UNKNOWN;
        break;
    }
  }

  if (error instanceof AuthError) {
    switch (error.type) {
      case "CredentialsSignin":
        err = ERRORRES.INVALID_CREDENTIALS;
        msg = "Invalid credentials";
        break;
      case "AccessDenied":
        err = ERRORRES.ACCESS_DENIED;
        msg = "SignIn Failed";
        break;

      default:
        err = ERRORRES.UNKNOWN;
        break;
    }
  }

  console.error(error && error instanceof Object ? (error as any).stack : error);

  return { status: err, message: msg, error };
};
