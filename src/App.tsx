import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TeamProvider } from "./context/TeamContext";
import { Layout } from "./components/common/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SuperAdminDashboard } from "./pages/SuperAdminDashboard";
import { Teams } from "./pages/Teams";
import { Providers } from "./pages/Providers";
import "./index.css";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const RoleBasedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <BrowserRouter>
        <AuthProvider>
          <TeamProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* Super Admin Only */}
                <Route
                  path="/super-admin"
                  element={
                    <RoleBasedRoute allowedRoles={["super_admin"]}>
                      <SuperAdminDashboard />
                    </RoleBasedRoute>
                  }
                />

                {/* Admin + Super Admin */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/providers" element={<Providers />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TeamProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
