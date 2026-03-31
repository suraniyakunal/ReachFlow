import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    user: any;
    login: (token: string, userData: any) => void;
    updateUser: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            // Redirect to login if not authenticated on load (unless already on auth pages or landing)
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register" && path !== "/") {
                navigate("/login");
            }
        }
    }, [navigate]);

    const login = (token: string, userData: any) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigate("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
        navigate("/login");
    };

    const updateUser = (userData: any) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
