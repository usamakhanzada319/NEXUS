import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  X,
  Zap,
  Box,
  Server,
  Clock,
  BarChart,
  DollarSign,
  Activity,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, isAdmin, isSuperAdmin } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/teams", label: "Teams", icon: Users },
    { path: "/providers", label: "Providers", icon: Box },
    { path: "/admin/providers", label: "Assign Providers", icon: Server },
    { path: "/analytics", label: "Analytics", icon: BarChart },
    { path: "/budget", label: "Budget", icon: DollarSign },
    { path: "/provider-health", label: "Provider Health", icon: Activity },
    { path: "/security", label: "Security", icon: Shield },
  ];

  //  Super Admin items
  const superAdminItems = [{ path: "/super-admin", label: "Super Admin" }];

  // Admin items
  const adminItems = [
    { path: "/audit-logs", label: "Audit Logs", icon: Clock },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary-500" />
          <span className="text-xl font-bold text-primary-500">NEXUS</span>
          <span className="text-xs text-muted-foreground">v1.0</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-muted lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {/* Main Nav Items */}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
              ${
                isActive
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}

        {/*  Super Admin Section */}
        {isSuperAdmin && (
          <div className="pt-2 mt-2 border-t border-border">
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && !isSuperAdmin && (
          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Admin
            </p>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <button
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
