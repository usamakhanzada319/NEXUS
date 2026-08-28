import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { apiClient } from "../api/client";
import { StatsCard } from "../components/dashboard/StatsCard";
import {
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Zap,
  Server,
  AlertTriangle,
  Clock,
  LogIn,
  LogOut,
  Key,
} from "lucide-react";
import { DashboardStats, AuditLog } from "../types";

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { currentTeam, teams } = useTeam();
  const [stats, setStats] = useState<DashboardStats>({
    totalSpend: 0,
    totalTeams: 0,
    totalProviders: 0,
    activeProviders: 0,
    anomalies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<AuditLog[]>([]);

  // FETCH RECENT ACTIVITIES

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const logs = await apiClient.getRecentAuditLogs(5);
        setRecentActivities(logs);
      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
      }
    };
    fetchActivities();
  }, []);

  // ACTION ICON MAPPING

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

  // FORMAT ACTION TEXT

  const formatAction = (action: string): string => {
    const map: Record<string, string> = {
      login: "logged in",
      logout: "logged out",
      create_team: "created team",
      update_team: "updated team",
      delete_team: "deleted team",
      create_provider: "added provider",
      update_provider: "updated provider",
      delete_provider: "deleted provider",
      assign_provider: "assigned provider",
      remove_provider: "removed provider",
      toggle_provider: "toggled provider",
      update_provider_config: "updated provider config",
      api_call: "made API call",
      spend_alert: "spend alert triggered",
    };
    return map[action] || action.replace(/_/g, " ");
  };

  // FORMAT TIME

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // FETCH STATS

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        if (currentTeam) {
          const [providers, spend] = await Promise.all([
            apiClient.getProviders(),
            apiClient.getSpend(currentTeam.id),
          ]);

          const totalSpend = spend.reduce((sum, s) => sum + s.amount, 0);
          const activeProviders = providers.filter((p) => p.isActive).length;

          setStats({
            totalSpend,
            totalTeams: teams.length,
            totalProviders: providers.length,
            activeProviders,
            anomalies: 0,
          });
        } else {
          const [teamsData, providers, spend] = await Promise.all([
            apiClient.getTeams(),
            apiClient.getProviders(),
            apiClient.getSpend(),
          ]);

          const totalSpend = spend.reduce((sum, s) => sum + s.amount, 0);
          const activeProviders = providers.filter((p) => p.isActive).length;

          setStats({
            totalSpend,
            totalTeams: teamsData.length,
            totalProviders: providers.length,
            activeProviders,
            anomalies: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [currentTeam, teams]);

  // STATS CARDS

  const statsCards = [
    {
      title: "Total Spend",
      value: `$${stats.totalSpend.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "blue" as const,
    },
    {
      title: "Total Teams",
      value: stats.totalTeams,
      change: "+2 this month",
      icon: Users,
      color: "green" as const,
    },
    {
      title: "Active Providers",
      value: `${stats.activeProviders}/${stats.totalProviders}`,
      change: `${stats.activeProviders} active`,
      icon: Server,
      color: "purple" as const,
    },
    {
      title: "Anomalies",
      value: stats.anomalies,
      change: "No issues",
      icon: AlertTriangle,
      color: "orange" as const,
    },
  ];

  // LOADING STATE

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {currentTeam ? `${currentTeam.name} Dashboard` : "Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your AI ops overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            change={card.change}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* QUICK ACTIONS + RECENT ACTIVITY (2 COLUMNS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-1">
            {isAdmin && (
              <>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-500 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-medium">Add New Team</span>
                    <p className="text-xs text-muted-foreground">
                      Create a new team for your organization
                    </p>
                  </div>
                </button>
                <hr className="border-border my-1" />

                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-500 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-medium">Add New Provider</span>
                    <p className="text-xs text-muted-foreground">
                      Add a new AI provider to the system
                    </p>
                  </div>
                </button>
                <hr className="border-border my-1" />
              </>
            )}

            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-500 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="font-medium">View Reports</span>
                <p className="text-xs text-muted-foreground">
                  Generate and download reports
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            ) : (
              recentActivities.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.userName}
                      <span className="font-normal text-muted-foreground">
                        {formatAction(log.action)}
                      </span>
                    </p>
                    {log.details?.team && (
                      <p className="text-xs text-muted-foreground truncate">
                        {log.details.team}
                        {log.details.provider && ` · ${log.details.provider}`}
                        {log.details.model && ` · ${log.details.model}`}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
