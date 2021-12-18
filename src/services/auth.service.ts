import { LoginRequestDto } from "../dtos";
import { jwtGenerator } from "../utils";
import { userService } from "../services";
import { LoginRequestSchema } from "../validations";
import { CredentialInvalid, InputInvalid } from "../exceptions";

export const authService = {
  async login(authData: LoginRequestDto): Promise<string> {
    const { error } = LoginRequestSchema.validate(authData);

    if (error) {
      throw new InputInvalid(error.message);
    }

    const { username, password } = authData;
    const user = await userService.getUserByLogin(username);

    if (password !== user.password) {
      throw new CredentialInvalid();
    }

    const jwt = jwtGenerator();
    return jwt;
  },
};
