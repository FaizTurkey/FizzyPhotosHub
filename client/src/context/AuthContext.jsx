import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../config/api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const res = await api.get("/api/auth/me");
                    if (res.data.user) {
                        setUser(res.data.user);
                        localStorage.setItem("user", JSON.stringify(res.data.user));

                    }

                } catch (error) {

                    logout();
                }
            }
            setLoading(false);
        }
        verifyToken();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post("/api/auth/login", { email, password });
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(receivedUser));
    }

    const register = async (name, email, password) => {
        const res = await api.post("/api/auth/register", { name, email, password });
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(receivedUser));
    }


    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

    }


    const value = { user, token, loading, login, register, logout }


    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}