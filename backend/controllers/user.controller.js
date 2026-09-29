import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -refreshToken")
            .lean();

        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -refreshToken -otp");
    
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
    
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({"message": "Unable to getCurrent User"});
    }
};