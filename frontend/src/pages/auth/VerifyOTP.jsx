import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    verifyOtp,
    resendOtp,
} from "../../api/authAPI";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    if (!email) {
        navigate("/signup");
        alert("email not transferred error (code logic)");
        return null;
    }

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const { data } = await verifySignupOTP({
                email,
                otp,
            });

            localStorage.setItem(
                "accessToken",
                data.accessToken
            );

            setUser(data.user);

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            setError("");
            setMessage("");

            const { data } = await resendSignupOTP({
                email,
            });

            setMessage(data.message);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to resend OTP."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">

                <h1 className="mb-2 text-3xl font-bold">
                    Verify Email
                </h1>

                <p className="mb-6 text-muted-foreground">
                    Enter the OTP sent to
                    <br />
                    <span className="font-medium text-foreground">
                        {email}
                    </span>
                </p>

                {error && (
                    <p className="mb-4 text-sm text-red-500">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="mb-4 text-sm text-green-500">
                        {message}
                    </p>
                )}

                <form
                    onSubmit={handleVerify}
                    className="space-y-5"
                >
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-xl tracking-[0.5em] outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>
                </form>

                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="mt-4 w-full rounded-xl border border-border py-3"
                >
                    {resending
                        ? "Sending..."
                        : "Resend OTP"}
                </button>

                <p className="mt-6 text-center text-sm">
                    Wrong email?{" "}
                    <Link
                        to="/signup"
                        className="text-primary"
                    >
                        Sign Up Again
                    </Link>
                </p>

            </div>
        </div>
    );
}