import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { StatsCard } from "../components/dashboard/StatsCard";
import { Team, Provider, Spend } from "../types";
import {
  DollarSign,
  Users,
  Server,
  AlertTriangle,
  Activity,
  ChevronRight,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface TeamSpendSummary {
  teamId: string;
  teamName: string;
  totalSpend: number;
  providerCount: number;
  activeProviders: number;
  anomalyCount: number;
}

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [allSpend, setAllSpend] = useState<Spend[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSpendSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [teamsData, providersData, spendData] = await Promise.all([
          apiClient.getTeams(),
          apiClient.getProviders(),
          apiClient.getSpend(),
        ]);

        setTeams(teamsData);
        setProviders(providersData);
        setAllSpend(spendData);

        // Calculate team summaries
        const summaries = teamsData.map((team) => {
          const teamSpend = spendData.filter((s) => s.teamId === team.id);
          const totalSpend = teamSpend.reduce((sum, s) => sum + s.amount, 0);
          const providerCount =
            teamSpend.length > 0
              ? new Set(teamSpend.map((s) => s.providerId)).size
              : 0;

          return {
            teamId: team.id,
            teamName: team.name,
            totalSpend,
            providerCount,
            activeProviders: 0, // Will calculate from team-provider mapping
            anomalyCount: 0,
          };
        });

        setTeamSummaries(summaries);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalSpend = allSpend.reduce((sum, s) => sum + s.amount, 0);
  const activeProviders = providers.filter((p) => p.isActive).length;
  const totalTeams = teams.length;
  const totalProviders = providers.length;

  const statsCards = [
    {
      title: "Total Spend (All Teams)",
      value: `$${totalSpend.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "blue" as const,
    },
    {
      title: "Total Teams",
      value: totalTeams,
      change: "+2 this month",
      icon: Users,
      color: "green" as const,
    },
    {
      title: "Total Providers",
      value: `${activeProviders}/${totalProviders}`,
      change: `${activeProviders} active`,
      icon: Server,
      color: "purple" as const,
    },
    {
      title: "Anomalies",
      value: "0",
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
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's the complete AI ops overview.
        </p>
      </div>

      {/* ===== Stats Cards ===== */}
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

      {/* ===== All Teams Overview ===== */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Teams Overview</h2>
          <button className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-muted-foreground">Team</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Total Spend
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Providers
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {teamSummaries.map((team) => (
                <tr
                  key={team.teamId}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 font-medium">{team.teamName}</td>
                  <td className="py-3">${team.totalSpend.toLocaleString()}</td>
                  <td className="py-3">{team.providerCount}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-primary-500 hover:text-primary-600 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== All Providers ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Providers List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">All Providers</h2>
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon || "🤖"}</span>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {provider.models.length} models
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      provider.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {provider.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${provider.pricing.input}/1M
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="flex-1">
                OpenAI API call logged (Team Alpha)
              </span>
              <span className="text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="flex-1">New provider added: Gemini</span>
              <span className="text-muted-foreground">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="flex-1">Team Alpha spend limit reached</span>
              <span className="text-muted-foreground">1 hour ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="flex-1">New team created: Delta Squad</span>
              <span className="text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-lg border border-border">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="flex-1">Anthropic API error (Team Beta)</span>
              <span className="text-muted-foreground">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-1">
          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium">Create New Team</span>
              <p className="text-xs text-muted-foreground">
                Add a new team to the platform
              </p>
            </div>
          </button>
          <hr className="border-border my-1" />

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 group">
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

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-500 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium">Generate Reports</span>
              <p className="text-xs text-muted-foreground">
                Create and download system reports
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
