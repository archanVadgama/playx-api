export {};
enum ResponseCategory {
  SUCCESS = "success",
  AUTH = "auth",
  TOKEN = "token",
  ERROR = "error",
  DATABASE = "database",
}

declare global {
  interface ILogIn {
    username: string;
    password: string;
    rememberMe: boolean;
  }
  interface IResetPassword {
    resetToken: string;
    password: string;
    confirmPassword: string;
  }
  interface IForgotPassword {
    email: string;
  }

  interface ISigUp extends ILogIn {
    displayName: string;
    mobileNumber: number;
    email: string;
  }

  interface IPrismaError {
    name: string;
    code: string;
    message: string;
    meta?: {
      target?: string[];
    };
  }

  interface IResponseCode {
    status: boolean;
    message: string;
  }

  interface JWTPayload {
    id: string;
    username: string;
    isAdmin: boolean;
  }
  interface UserPayload {
    image?: string;
    username: string;
    displayName: string;
    channelName?: string;
    bio?: string;
    email: string;
    mobileNumber: number;
    password: string;
    landmark?: string;
    addressLine1?: string;
    addressLine2?: string;
    countryId?: number;
    stateId?: number;
    cityId?: number;
  }

  type ResponseCodeMap = Record<ResponseCategory, Record<string, IResponseCode>>;
}
