import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { CreateUserRequestDto } from "../dtos";
import { Logger } from "../logger";
import { API_MESSAGES } from "../shared/messages";

const {
  getUserById,
  getUserAutoSuggestion,
  createUser,
  updateUser,
  deleteUser,
} = userService;

const logger = Logger("user-controller");

export const userController = {
  async getUserById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    logger.info(`Finding user with id = ${id}`);

    try {
      const user = await getUserById(id);
      logger.info(`Found user with id = ${user.id}`);
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  },
  async getUserAutoSuggestion(
    req: Request<{}, {}, {}, { loginQuery: string; limit: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { loginQuery, limit } = req.query;
    logger.info(`Getting user auto suggestions`);
    logger.info(`loginQuery: ${loginQuery}`);
    logger.info(`limit: ${limit}`);

    try {
      const suggests = await getUserAutoSuggestion(loginQuery, limit);
      res.json(suggests);
    } catch (error) {
      next(error);
    }
  },
  async createUser(
    req: Request<{}, {}, CreateUserRequestDto>,
    res: Response,
    next: NextFunction
  ) {
    const userData = req.body;
    logger.info(`Creating new user`);
    logger.info(userData);

    try {
      await createUser(userData);
      logger.info(`Created user`);
      res.status(201).json({ message: API_MESSAGES.USER_CREATED_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  },
  async updateUser(
    req: Request<{ id: string }, {}, CreateUserRequestDto>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    const userData = req.body;
    logger.info(`Updating user with id = ${id}`);
    logger.info(userData);

    try {
      const user = await updateUser(id, userData);
      logger.info(`Updated user with id = ${id}`);
      res.json(user);
    } catch (error: any) {
      next(error);
    }
  },
  async deleteUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    logger.info(`Removing user with ${id}`);

    try {
      await deleteUser(id);
      logger.info(`Removed user with id = ${id}`);
      res.json({ message: API_MESSAGES.USER_DELETED_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  },
};
