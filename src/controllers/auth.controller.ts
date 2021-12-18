import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import { LoginRequestDto } from "../dtos";
import { Logger } from "../logger";
import { API_MESSAGES } from "../shared/messages";

const { login } = authService;

const logger = Logger("auth-controller");

export const authController = {
  async login(
    req: Request<{}, {}, LoginRequestDto>,
    res: Response,
    next: NextFunction
  ) {
    logger.info(`Log in`);
    const authData = req.body;

    try {
      const token = await login(authData);
      res.json({ token: token });
    } catch (error: any) {
      next(error);
    }
  },
};
