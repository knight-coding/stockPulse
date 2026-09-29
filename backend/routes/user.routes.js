import express from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getAllUsers, getCurrentUser } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.get("/me", getCurrentUser);

export default userRoute;