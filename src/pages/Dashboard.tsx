import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalSpend: 0,
    totalTeams: 0,
    totalProviders: 0,
    activeProviders: 0,
    anomalies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teams, providers, spend] = await Promise.all([
          apiClient.getTeams(),
          apiClient.getProviders(),
          apiClient.getSpend(),
        ]);
        const totalSpend = spend.reduce((sum, s) => sum + s.amount, 0);
        const activeProviders = providers.filter(
          (provider) => provider.isActive,
        ).length;

        setStats({
          totalSpend,
          totalTeams: teams.length,
          totalProviders: providers.length,
          activeProviders,
          anomalies: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Spend",
      value: `$${stats.totalSpend.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Total Teams",
      value: stats.totalTeams,
      change: "+2 this month",
      icon: Users,
      color: "green",
    },

    {
      title: "Active Providers",
      value: `${stats.activeProviders}/${stats.totalProviders}`,
      change: `${stats.activeProviders} active`,
      icon: Server,
      color: "purple",
    },
    {
      title: "Anomalies",
      value: stats.anomalies,
      change: "No issues",
      icon: AlertTriangle,
      color: "orange",
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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back,{user?.name}! Here's your AI ops overview.
        </p>
      </div>
      {/* Stats */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      {/* Quick Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {isAdmin && (
              <>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary-500" />
                  <span>Add New Team</span>
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
                  <Server className="h-4 w-4 text-primary-500" />
                  <span>Add New Provider</span>
                </button>
              </>
            )}
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-primary-500" />
              <span>View Reports</span>
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>OpenAI API call logged</span>
              <span className="text-muted-foreground ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>New provider added: Gemini</span>
              <span className="text-muted-foreground ml-auto">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Team Alpha spend limit reached</span>
              <span className="text-muted-foreground ml-auto">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
