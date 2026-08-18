import { Menu, Bell, User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Mobile menu button */}

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-muted lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Center :Search(optinal)  */}

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        {/* Right: Actions */}

        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          {/* Notifications */}

          <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {/* User Profile */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || "User"}
              </span>
            </button>
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border py-1 hidden group-hover:block">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-primary-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
