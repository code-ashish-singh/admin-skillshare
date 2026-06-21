import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        const user = res.data.data.user;
        if (user.role === "superAdmin") setAdmin(user);
        else setAdmin(null);
      })
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.data.user;
      if (user.role !== "superAdmin") {
        return { success: false, message: "Access denied. Admin only." };
      }
      setAdmin(user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
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