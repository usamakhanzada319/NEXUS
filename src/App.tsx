import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TeamProvider } from "./context/TeamContext";
import { Layout } from "./components/common/Layout";
import "./index.css";
import {
  NotificationProvider,
  useNotification,
} from "./context/NotificationContext";
import { Toast } from "./components/common/Toast";
import { BudgetProvider } from "./context/BudgetContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { PageLoader } from "./components/common/Loaders";

// Lazy load pages for better performance

const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login })),
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Teams = lazy(() =>
  import("./pages/Teams").then((m) => ({ default: m.Teams })),
);
const Providers = lazy(() =>
  import("./pages/Providers").then((m) => ({ default: m.Providers })),
);
const Analytics = lazy(() =>
  import("./pages/Analytics").then((m) => ({ default: m.Analytics })),
);
const Budget = lazy(() =>
  import("./pages/Budget").then((m) => ({ default: m.Budget })),
);
const ProviderHealth = lazy(() =>
  import("./pages/ProviderHealth").then((m) => ({ default: m.ProviderHealth })),
);
const SecuritySetting = lazy(() =>
  import("./pages/SecuritySettings").then((m) => ({
    default: m.SecuritySetting,
  })),
);
const Billing = lazy(() =>
  import("./pages/Billing").then((m) => ({ default: m.Billing })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);
const SuperAdminDashboard = lazy(() =>
  import("./pages/SuperAdminDashboard").then((m) => ({
    default: m.SuperAdminDashboard,
  })),
);
const AdminTeamProviders = lazy(() =>
  import("./pages/AdminTeamProviders").then((m) => ({
    default: m.AdminTeamProviders,
  })),
);
const AuditLogs = lazy(() =>
  import("./pages/AuditLogs").then((m) => ({ default: m.AuditLogs })),
);
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
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <TeamProvider>
              <BudgetProvider>
                <Suspense fallback={<PageLoader />}>
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
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <AdminTeamProviders />
                            </RoleBasedRoute>
                          }
                        />
                        <Route
                          path="/analytics"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <Analytics />
                            </RoleBasedRoute>
                          }
                        />

                        <Route
                          path="/audit-logs"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <AuditLogs />
                            </RoleBasedRoute>
                          }
                        />

                        <Route
                          path="/budget"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <Budget />
                            </RoleBasedRoute>
                          }
                        />
                        <Route
                          path="/provider-health"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <ProviderHealth />
                            </RoleBasedRoute>
                          }
                        />
                        <Route
                          path="/security"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <SecuritySetting />
                            </RoleBasedRoute>
                          }
                        />
                        <Route
                          path="/billing"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <Billing />
                            </RoleBasedRoute>
                          }
                        />

                        <Route
                          path="/settings"
                          element={
                            <RoleBasedRoute
                              allowedRoles={["admin", "super_admin"]}
                            >
                              <Settings />
                            </RoleBasedRoute>
                          }
                        />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <ToastContainer />
                  </NotificationProvider>
                </Suspense>
              </BudgetProvider>
            </TeamProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
