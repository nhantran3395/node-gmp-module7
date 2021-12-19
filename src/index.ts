import express, { NextFunction } from "express";
import cors from "cors";
import "./configs/dotenv.config";
import { sequelize } from "./configs";
import { userRouter, groupRouter, authRouter } from "./routes";
import { Logger } from "./logger";
import {
  errorHandlingMiddleware,
  routeNotExistsHandlingMiddleware,
  morganMiddleware,
  tokenAuthorizerMiddleware,
} from "./middlewares";
import "./models/associations";

const app = express();
const port = process.env.APPLICATION_PORT ?? 3002;
const logger = Logger("index");

app.use(express.json());
app.use(cors());
app.use(morganMiddleware);

app.get("/", function (req, res) {
  res.json({ message: "module 4 application is running" });
});

app.get("/databaseconnection", async function (req, res, next: NextFunction) {
  try {
    await sequelize.authenticate();
    res.json({ message: "successfully connected to database" });
  } catch (err) {
    next(err);
  }
});

app.use("/", authRouter);
app.use("/users", tokenAuthorizerMiddleware, userRouter);
app.use("/groups", tokenAuthorizerMiddleware, groupRouter);

app.use(errorHandlingMiddleware);

app.use(routeNotExistsHandlingMiddleware);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
