import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/authAPI";
import Loader from "../components/ui/Loader";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await getCurrentUser();

            setUser(data.user);
        } catch (err) {
            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (credentials) => {
        const { data } = await loginUser(credentials);
        localStorage.setItem("accessToken", data.accessToken);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
        }
    };

    const signup = async (payload) => {
        const { data } = await registerUser(payload);

        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
        }
        return data;
    };

    if (isLoading) return <Loader />;

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                signup,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}