import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/api/authApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "farmer_rice_token";
const USER_KEY = "farmer_rice_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount, then verify with /me
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          /* ignore parse error */
        }
      }

      try {
        const { data } = await authAPI.getMe();
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
