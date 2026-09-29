import express from "express";
import { forgotPassword, handleLogin, handleLogout, refreshAccessToken, registerUser, verifySignupOTP } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", handleLogin);
authRoute.post("/logout", handleLogout);
authRoute.post("/verify-otp", verifySignupOTP);
authRoute.post("/refresh-token", refreshAccessToken);
authRoute.post("/forgot-password", forgotPassword);

export default authRoute;