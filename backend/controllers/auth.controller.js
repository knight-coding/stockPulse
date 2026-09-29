import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

/* ---------------- Mail Transport ---------------- */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/* ---------------- Helper Functions ---------------- */

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
        `,
    });
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            UserInfo: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

/* ========================================================= */
/* ===================== REGISTER =========================== */
/* ========================================================= */

// This function does two things. Register with email verification and without verification depending upon "process.env.ENABLE_EMAIL_VERIFICATION" For deployment I am using without verification
export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const EMAIL_VERIFICATION_ENABLED =
            process.env.ENABLE_EMAIL_VERIFICATION === "true";

        let existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser && existingUser.isVerified) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let otp;
        let hashedOTP;

        if (EMAIL_VERIFICATION_ENABLED) {
            otp = generateOTP();
            hashedOTP = await bcrypt.hash(otp, 10);
        }

        // User exists but not verified
        if (existingUser && !existingUser.isVerified) {
            existingUser.name = name;
            existingUser.username = username;
            existingUser.password = hashedPassword;
            existingUser.isVerified = false;

            if (EMAIL_VERIFICATION_ENABLED) {
                existingUser.otp = hashedOTP;
                existingUser.otpExpiry = Date.now() + 5 * 60 * 1000;

                await existingUser.save();
                await sendOTP(email, otp);

                return res.status(200).json({
                    success: true,
                    message: "OTP resent successfully.",
                });
            }

            existingUser.otp = undefined;
            existingUser.otpExpiry = undefined;
            existingUser.isVerified = true;

            const accessToken = generateAccessToken(existingUser);
            const refreshToken = generateRefreshToken(existingUser);

            existingUser.refreshToken = refreshToken;
            await existingUser.save();

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Registered successfully.",
                accessToken,
            });
        }

        // Create new user
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            otp: EMAIL_VERIFICATION_ENABLED ? hashedOTP : undefined,
            otpExpiry: EMAIL_VERIFICATION_ENABLED
                ? Date.now() + 5 * 60 * 1000
                : undefined,
            isVerified: !EMAIL_VERIFICATION_ENABLED,
            authProvider: "local",
        });

        if (EMAIL_VERIFICATION_ENABLED) {
            await sendOTP(email, otp);

            return res.status(201).json({
                success: true,
                message: "OTP sent successfully.",
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "Registered successfully.",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ========================================================= */
/* ================= VERIFY SIGNUP OTP ====================== */
/* ========================================================= */

export const verifySignupOTP = async (req, res) => {
    try {
        if (!EMAIL_VERIFICATION_ENABLED) {
            return res.status(403).json({
                success: false,
                message: "Email verification is disabled.",
            });
        }

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified.",
            });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired.",
            });
        }

        const match = await bcrypt.compare(otp, user.otp);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;

        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true, // change to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ========================================================= */
/* ==================== RESEND OTP ========================== */
/* ========================================================= */

export const resendSignupOTP = async (req, res) => {
    try {
        if (!EMAIL_VERIFICATION_ENABLED) {
            return res.status(403).json({
                success: false,
                message: "Email verification is disabled.",
            });
        }
        
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified.",
            });
        }

        const otp = generateOTP();

        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendOTP(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(401);
        }
    
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);
    
                const user = await User.findById(decoded.id);
    
                if (!user) return res.sendStatus(401);
    
                if (user.refreshToken !== refreshToken) {
                    return res.sendStatus(403);
                }
    
                const accessToken = generateAccessToken(user);
    
                return res.status(200).json({
                    accessToken,
                });
            }
        );
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Unable to create new accessToken"});
    }
};

export const handleLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Username and password are required.",
            });
        }

        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() },
            ],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first.",
            });
        }

        if (user.authProvider !== "local") {
            return res.status(400).json({
                success: false,
                message: `Please login using ${user.authProvider}.`,
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;

        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Function to reset password with email OTP
export const forgotPassword = async (req, res) => {
    try {
        if (!EMAIL_VERIFICATION_ENABLED) {
            return res.status(403).json({
                success: false,
                message: "Email verification is disabled.",
            });
        }
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please Register first",
            });
        }

        /*
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first.",
            });
        } 
        */

        if (user.authProvider !== "local") {
            return res.status(400).json({
                success: false,
                message: `This account uses ${user.authProvider}. Please login using ${user.authProvider}.`,
            });
        }

        const otp = generateOTP();

        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendOTP(user.email, otp);

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const handleLogout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};