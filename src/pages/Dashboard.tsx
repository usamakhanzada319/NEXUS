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
} from "lucide-react";
import { DashboardStats } from "../types";

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

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        //  If team is selected, fetch team-specific data
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
          //  No team selected — show all data
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
      <div>
        <h1 className="text-2xl font-bold">
          {currentTeam ? `${currentTeam.name} Dashboard` : "Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your AI ops overview.
        </p>
      </div>

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
    </div>
  );
};
