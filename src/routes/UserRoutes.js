import Router from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  verifyUserAndGetDetails,
} from "../controllers/UserController.js";

export const UserRouter = Router();

UserRouter.post("/register-user", registerUser);
UserRouter.post("/login-user", loginUser);
UserRouter.put("/update-user/:userId", updateUser);
UserRouter.get("/verify-user/:id", verifyUserAndGetDetails);
