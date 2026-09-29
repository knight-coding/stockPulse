import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },

    otp: {
        type: String,
    },

    otpExpiry: {
        type: Date,
    },

    refreshToken: {
        type: String,
    },

    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;