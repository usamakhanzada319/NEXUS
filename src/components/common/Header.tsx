import React, { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTeam } from "../../context/TeamContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { currentTeam, teams, switchTeam } = useTeam();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTeamSwitch = (teamId: string) => {
    switchTeam(teamId);
    setIsTeamDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* LEFT SECTION  */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* CENTER: SEARCH*/}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Team Switcher */}
          {currentTeam && (
            <div className="relative">
              <button
                onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {currentTeam.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Dropdown */}
              {isTeamDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border dark:border-gray-700 py-1 z-[100]">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeamSwitch(team.id)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        currentTeam.id === team.id
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {team.name}
                      {currentTeam.id === team.id && (
                        <span className="ml-2 text-xs text-primary-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/*  RIGHT SECTION  */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-medium hidden sm:block text-gray-700 dark:text-gray-200">
                {user?.name || "User"}
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border dark:border-gray-700 py-1 hidden group-hover:block z-[100]">
              <div className="px-4 py-2 border-b border-border dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  {user?.email}
                </p>
                <p className="text-xs text-primary-500 capitalize">
                  {user?.role}
                </p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
    </header>
  );
};
