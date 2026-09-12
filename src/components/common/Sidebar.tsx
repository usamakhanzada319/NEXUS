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
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, isAdmin, isSuperAdmin } = useAuth();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "super_admin", "user"],
    },
    {
      path: "/teams",
      label: "Teams",
      icon: Users,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/providers",
      label: "Providers",
      icon: Box,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/admin/providers",
      label: "Assign Providers",
      icon: Server,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/budget",
      label: "Budget",
      icon: DollarSign,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/provider-health",
      label: "Provider Health",
      icon: Activity,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/security",
      label: "Security",
      icon: Shield,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/billing",
      label: "Billing",
      icon: FileText,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
      roles: ["admin", "super_admin"],
    },
    {
      path: "/audit-logs",
      label: "Audit Logs",
      icon: Clock,
      roles: ["admin", "super_admin"],
    },
    { path: "/super-admin", label: "Super Admin", roles: ["super_admin"] },
  ];

  //  filter items based on role

  const filteredNavItems = navItems.filter((item) => {
    if (isSuperAdmin) return true; // super admin access and see every thing
    if (isAdmin)
      return item.roles.includes("admin") || item.roles.includes("user");
    return item.roles.includes("user");
  });

  // Helper for NavLink className

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
    ${
      isActive
        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }
  `;
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-border
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
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
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Main Nav Items */}
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={getNavLinkClass}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border shrink-0">
        <button
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
