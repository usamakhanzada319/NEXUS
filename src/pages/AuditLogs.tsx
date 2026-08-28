import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { AuditLog, AuditAction } from "../types";

import {
  Search,
  Filter,
  Download,
  Clock,
  LogIn,
  LogOut,
  Users,
  Server,
  Key,
  AlertTriangle,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const AuditLogs: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLog] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLog = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.getAuditLogs();
        setLogs(data);
        setFilteredLog(data);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLog();
  }, []);

  // Filter logs
  useEffect(() => {
    let result = logs;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result.filter(
        (log) =>
          log.userName.toLowerCase().includes(term) ||
          log.userEmail.toLowerCase().includes(term) ||
          log.action.includes(term) ||
          JSON.stringify(log.details).toLowerCase().includes(term),
      );
    }

    // Action filter

    if (filterAction !== "all") {
      result = result.filter((log) => log.action === filterAction);
    }
    setFilteredLog(result);
    setCurrentPage(1);
  }, [searchTerm, filterAction, logs]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn className="h-4 w-4 text-green-500" />;
      case "logout":
        return <LogOut className="h-4 w-4 text-red-500" />;
      case "create_team":
      case "update_team":
      case "delete_team":
        return <Users className="h-4 w-4 text-blue-500" />;

      case "assign_provider":
      case "remove_provider":
      case "toggle_provider":
      case "update_provider_config":
        return <Server className="h-4 w-4 text-purple-500" />;

      case "api_call":
        return <Activity className="h-4 w-4 text-indigo-500" />;
      case "spend_alert":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: "text-green-600 dark:text-green-400",
      logout: "text-red-600 dark:text-red-400",
      create_team: "text-blue-600 dark:text-blue-400",
      update_team: "text-blue-600 dark:text-blue-400",
      delete_team: "text-red-600 dark:text-red-400",
      assign_provider: "text-purple-600 dark:text-purple-400",
      remove_provider: "text-red-600 dark:text-red-400",
      toggle_provider: "text-yellow-600 dark:text-yellow-400",
      update_provider_config: "text-indigo-600 dark:text-indigo-400",
      api_call: "text-cyan-600 dark:text-cyan-400",
      spend_alert: "text-orange-600 dark:text-orange-400",
    };

    return colors[action] || "text-gray-600 dark:text-gray-400";
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const actionOption = [
    { value: "all", label: "All Actions" },
    { value: "login", label: "Login" },
    { value: "logout", label: "Logout" },
    { value: "create_team", label: "Create Team" },
    { value: "update_team", label: "Update Team" },
    { value: "delete_team", label: "Delete Team" },
    { value: "assign_provider", label: "Assign Provider" },
    { value: "remove_provider", label: "Remove Provider" },
    { value: "toggle_provider", label: "Toggle Provider" },
    { value: "update_provider_config", label: "Update Provider Config" },
    { value: "api_call", label: "API Call" },
    { value: "spend_alert", label: "Spend Alert" },
  ];

  // Pagination

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all activities across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredLogs.length} entries
          </span>
        </div>
      </div>

      {/* Filters */}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* search */}

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search Logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {/* Action Filter */}

          <div className="reletive">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              {actionOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No logs found
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                      {formatTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {getActionIcon(log.action)}
                        </span>
                        <span
                          className={`font-medium ${getActionColor(log.action)}`}
                        >
                          {log.action.replace(/-/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-muted-foreground">
                        {Object.entries(log.details).map(([Key, value]) => (
                          <span key={Key} className="inline-block mr-2">
                            <span className="font-medium">{Key}:</span>
                            {String(value)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
