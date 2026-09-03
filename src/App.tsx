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
import { AdminTeamProviders } from "./pages/AdminTeamProviders";
import {
  NotificationProvider,
  useNotification,
} from "./context/NotificationContext";
import { AuditLogs } from "./pages/AuditLogs";
import { Toast } from "./components/common/Toast";
import { Analytics } from "./pages/Analytics";
import { Budget } from "./pages/Budget";
import { BudgetProvider } from "./context/BudgetContext";
import { ProviderHealth } from "./pages/ProviderHealth";

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

const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <Toast notification={notification} onRemove={removeNotification} />
        </div>
      ))}
    </div>
  );
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
            <BudgetProvider>
              <NotificationProvider>
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
                    <Route
                      path="/admin/providers"
                      element={
                        <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
                          <AdminTeamProviders />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
                          <Analytics />
                        </RoleBasedRoute>
                      }
                    />

                    <Route
                      path="/audit-logs"
                      element={
                        <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
                          <AuditLogs />
                        </RoleBasedRoute>
                      }
                    />

                    <Route
                      path="/budget"
                      element={
                        <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
                          <Budget />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/provider-health"
                      element={
                        <RoleBasedRoute allowedRoles={["admin", "super_admin"]}>
                          <ProviderHealth />
                        </RoleBasedRoute>
                      }
                    />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer />
              </NotificationProvider>
            </BudgetProvider>
          </TeamProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
