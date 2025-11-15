import { IUser } from "./user.interface";

export interface ILoginResponse {
  access_token: string;
  user: IUser
}