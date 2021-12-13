import { Sequelize } from "sequelize";
import { Logger } from "../logger";

const databaseUri = process.env.DATABASE_URI ?? "";
const logger = Logger("sequelize");

const sequelize = new Sequelize(databaseUri, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: (msg) => logger.debug(msg),
});

export { sequelize };
