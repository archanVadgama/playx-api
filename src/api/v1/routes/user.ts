import express from "express";
import { checkLogin } from "../middleware/authCheck.js";
import { UserController } from "../controller/user/userController.js";
import { checkSchema } from "express-validator";
import { updateUser } from "../validation/auth.js";

const router = express.Router();

// [PROTECTED] Update user route
router.get("/user/:id", checkLogin, UserController.getUser);
router.put("/user/:id", checkLogin, checkSchema(updateUser), UserController.updateUser);

export default router;
