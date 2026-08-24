import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, UserRole } from "../types";
import { apiClient } from "../api/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; redirectTo?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isTeamLead: boolean;
  isViewer: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("nexus_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("nexus_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; redirectTo?: string }> => {
    setIsLoading(true);
    try {
      const users = await apiClient.getUsers();
      const foundUser = users.find((u) => u.email === email);

      if (foundUser && password.length > 0) {
        setUser(foundUser);
        localStorage.setItem("nexus_user", JSON.stringify(foundUser));

        let redirectTo = "/";
        if (foundUser.role === "super_admin") {
          redirectTo = "/super-admin";
        } else if (foundUser.role === "admin") {
          redirectTo = "/";
        } else if (foundUser.role === "team_lead") {
          redirectTo = "/";
        } else {
          redirectTo = "/";
        }

        return { success: true, redirectTo };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("nexus_user");
    localStorage.removeItem("nexus_current_team");
  }, []);

  const isAuthenticated = user !== null;
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isTeamLead = user?.role === "team_lead" || isAdmin;
  const isViewer = user?.role === "viewer";

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        isSuperAdmin,
        isAdmin,
        isTeamLead,
        isViewer,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
