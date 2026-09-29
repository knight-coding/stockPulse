import api from "./axios";

export const registerUser = (payload) => {
    // payload: { name, email, password }
    return api.post("/auth/register", payload);
};

export const loginUser = (payload) => {
    // payload: { email, password }
    return api.post("/auth/login", payload);
};

export const logoutUser = () => {
    return api.post("/auth/logout");
};

export const resendOtp = (email, purpose) => {
    // purpose: "signup" | "reset"
    return api.post("/auth/resend-otp", { email, purpose });
};

/**
 * Single OTP verification endpoint shared by signup and password-reset flows.
 * `purpose` tells the backend which OTP record to check, and the response
 * for a "reset" purpose includes a short-lived resetToken used on the
 * ResetPassword page.
 */
export const verifyOtp = ({ email, otp}) => {
    return api.post("/auth/verify-otp", { email, otp});
};

export const forgotPassword = (email) => {
    return api.post("/auth/forgot-password", { email });
};

export const resetPassword = ({ email, resetToken, newPassword }) => {
    return api.post("/auth/reset-password", { email, resetToken, newPassword });
};

export const getCurrentUser = () => {
    return api.get("/users/me");
};