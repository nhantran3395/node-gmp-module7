import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { API_MESSAGES } from "../shared/messages";

const tokenValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: API_MESSAGES.UNAUTHORIZED });
  }

  try {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET as string
    );

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(403).json({ message: API_MESSAGES.TOKEN_EXPIRED });
    }

    return res.status(403).json({ message: API_MESSAGES.TOKEN_INVALID });
  }
};

export default tokenValidatorMiddleware;
