import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

export type UserRole = "member" | "admin" | "manager" | "receptionist" | "trainer" | "super_admin";

export interface AuthUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membership?: "Basic" | "Pro" | "Elite" | "none" | null;
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isAuthLoading: boolean;
  isLoggingOut: boolean; // <-- NEW: Tracks logout progress for UX
  login: (user: AuthUser, token?: string) => void;
  logout: () => Promise<void>; // <-- NEW: Now asynchronous
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Set global axios defaults for Sanctum
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  axios.defaults.baseURL = "http://localhost:8000";

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get("/api/user");
        
        if (response.data) {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const fetchedUser = response.data;
            let membership = null;
            if (fetchedUser.membership_plan && fetchedUser.membership_plan !== 'none') {
              membership = fetchedUser.membership_plan.charAt(0).toUpperCase() + fetchedUser.membership_plan.slice(1);
            }

            setUser({
              id: fetchedUser.id,
              firstName: fetchedUser.first_name,
              lastName: fetchedUser.last_name,
              email: fetchedUser.email,
              phone: fetchedUser.phone,
              membership: membership as "Basic" | "Pro" | "Elite" | null,
              role: fetchedUser.role,
            });
          }
        }
      } catch (error) {
        console.error("Session expired or invalid", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (userData: AuthUser, token?: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  // --- UPGRADED LOGOUT FUNCTION ---
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Tell Laravel to destroy the session cookie and revoke tokens
      // (Adjust to "/logout" if your Laravel setup uses the default web route instead of API)
      await axios.post("/api/logout").catch(() => axios.post("/logout")); 
    } catch (error) {
      console.error("Error during server logout", error);
    } finally {
      // 2. Wipe the frontend memory regardless of server response
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setIsLoggingOut(false);
    }
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => {
      const updatedUser = prev ? { ...prev, ...updates } : prev;
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return updatedUser;
    });
  };

  const isAdmin = !!user && ["admin", "manager", "super_admin"].includes(user.role ?? "");

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isAdmin, isAuthLoading, isLoggingOut, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}