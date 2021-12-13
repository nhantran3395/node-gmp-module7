import { Request, Response, NextFunction } from "express";
import { groupService } from "../services";
import { Logger } from "../logger";
import { CreateGroupRequestDto } from "../dtos";
import { API_MESSAGES } from "../shared/messages";
import { AddUsersToGroupRequestDto } from "../dtos/add-users-to-group-request.dto";

const {
  getGroupById,
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  addUsersToGroup,
} = groupService;

const logger = Logger("group-controller");

export const groupController = {
  async getGroupById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    logger.info(`Finding group with id = ${id}`);

    try {
      const group = await getGroupById(id);
      logger.info(`Found group with id = ${group.id}`);
      res.json(group);
    } catch (error: any) {
      next(error);
    }
  },
  async getAllGroups(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    logger.info(`Finding all groups`);

    try {
      const groups = await getAllGroups();
      res.json(groups);
    } catch (error) {
      next(error);
    }
  },
  async createGroup(
    req: Request<{}, {}, CreateGroupRequestDto, {}>,
    res: Response,
    next: NextFunction
  ) {
    const groupData = req.body;
    logger.info(`Creating new group`);
    logger.info(groupData);

    try {
      await createGroup(groupData);
      logger.info(`Created group`);
      res.status(201).json({ message: API_MESSAGES.GROUP_CREATED_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  },
  async updateGroup(
    req: Request<{ id: string }, {}, CreateGroupRequestDto>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    const groupData = req.body;
    logger.info(`Updating group with id = ${id}`);
    logger.info(groupData);

    try {
      const group = await updateGroup(id, groupData);
      logger.info(`Updated group with id = ${id}`);
      res.json(group);
    } catch (error: any) {
      next(error);
    }
  },
  async deleteGroup(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    logger.info(`Removing group with id = ${id}`);

    try {
      await deleteGroup(id);
      logger.info(`Removed group with id = ${id}`);
      res.json({ message: API_MESSAGES.GROUP_DELETED_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  },
  async addUsersToGroup(
    req: Request<{}, {}, AddUsersToGroupRequestDto, {}>,
    res: Response,
    next: NextFunction
  ) {
    const data = req.body;
    logger.info(`Adding users to group`);
    logger.info(data);

    try {
      await addUsersToGroup(data);
      res.json({ message: API_MESSAGES.USERS_ADDED_TO_GROUP_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  },
};
