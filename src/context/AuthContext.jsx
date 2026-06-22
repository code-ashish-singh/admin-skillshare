import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ss_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ss_admin_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(res => {
        const user = res.data.data.user;
        if (user.role === "superAdmin") setAdmin(user);
        else { localStorage.removeItem("ss_admin_token"); setAdmin(null); }
      })
      .catch(() => { localStorage.removeItem("ss_admin_token"); setAdmin(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.data.user;
      if (user.role !== "superAdmin") {
        return { success: false, message: "Access denied. Admin only." };
      }
      const token = res.data.data.token;
      if (token) localStorage.setItem("ss_admin_token", token);
      setAdmin(user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("ss_admin_token");
    setAdmin(null);
  };

  const updateAdmin = async (data) => {
    try {
      const res = await api.put("/auth/update-profile", data);
      setAdmin(res.data.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin"/></div>;

  return (
    <AuthContext.Provider value={{ admin, login, logout, updateAdmin, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth inside AuthProvider only");
  return ctx;
};