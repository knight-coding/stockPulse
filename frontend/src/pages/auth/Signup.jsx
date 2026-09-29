import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {

    const navigate = useNavigate();
    const { signup } = useAuth();

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await signup(form);

            if (data.accessToken) {
                navigate("/");
            } else {
                navigate("/verify-otp", {
                    state: {
                        email: form.email,
                    },
                });
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Signup failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 bg-mesh">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">

                <h1 className="mb-2 text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-8 text-muted-foreground">
                    Join StockPulse today
                </p>

                {error && (
                    <p className="mb-4 text-sm text-red-500">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    />

                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}