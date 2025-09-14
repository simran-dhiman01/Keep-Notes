import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await api.post("/user/login", { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setError(null);
                navigate("/", { replace: true });
                return res.data.user;
            }
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            setError(error.response?.data?.message || "Login Failed");
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/user/logout"); // clears cookie on backend
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const getNotes = async () => {
        try {
            const res = await api.get("/notes");
            if (res.data.success) {
                setNotes(res.data.notes);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const upgradePlan = async () => {
        try {
            setLoading(true);
            if (!user) return;
            const slug = user.tenantId.slug; // or a slug field if you have
            const res = await api.post(`/tenants/${slug}/upgrade`);
            if (res.data.success) {
                // Update user object in state to reflect new plan
                setUser(prev => ({
                    ...prev,
                    tenantId: { ...prev.tenantId, plan: 'pro' }
                }));
                localStorage.setItem("user", JSON.stringify({
                    ...user,
                    tenantId: { ...user.tenantId, plan: 'pro' }
                }));
                alert("Tenant upgraded to Pro successfully!");
            }
        } catch (error) {
            console.error("Upgrade failed : ", error.response?.data?.message || error.message);
        }
        finally{
            setLoading(false);
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error, getNotes, notes, upgradePlan }}>
            {children}
        </AuthContext.Provider>
    );
};
