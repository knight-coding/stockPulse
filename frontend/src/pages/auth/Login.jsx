import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        identifier: "",
        password: "",
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

        try {
            setLoading(true);
            setError("");

            await login(form);

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 bg-mesh">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">

                <h1 className="mb-2 text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-8 text-muted-foreground">
                    Login to your StockPulse account
                </p>

                {error && (
                    <p className="mb-4 text-sm text-red-500">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <input
                        name="identifier"
                        placeholder="Email or Username"
                        value={form.identifier}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none"
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-primary"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
}