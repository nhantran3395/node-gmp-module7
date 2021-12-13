import { User } from "../models";
import { LoginRequestDto } from "../dtos";

export const authService = {
  async login(authData: LoginRequestDto): Promise<void> {},
};
