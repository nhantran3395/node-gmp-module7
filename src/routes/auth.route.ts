import { Router } from "express";
import { authController, commonController } from "../controllers";

const router = Router();

const { login } = authController;
const { handleMethodNotAllowed } = commonController;

router.post("/login", login);
router.all("/", handleMethodNotAllowed);

export default router;
