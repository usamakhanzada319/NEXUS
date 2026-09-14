import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import {
  Activity,
  Zap,
  DollarSign,
  Clock,
  Server,
  BarChart,
} from "lucide-react";
import {
  AnalyticsStats,
  ProviderAnalytics,
  ModelAnalytics,
  APICallLog,
} from "../types";
import {
  CardListSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "../components/common/Loaders";

export const Analytics: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [providerAnalytics, setProviderAnalytics] = useState<
    ProviderAnalytics[]
  >([]);
  const [modelAnalytics, setModelAnalytics] = useState<ModelAnalytics[]>([]);
  const [recentCalls, setRecentCalls] = useState<APICallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [statsData, providerData, modelData, calls] = await Promise.all([
          apiClient.getAnalyticsStats(),
          apiClient.getProviderAnalytics(),
          apiClient.getModelAnalytics(),
          apiClient.getAPICallLogs(),
        ]);

        setStats(statsData);
        setProviderAnalytics(providerData);
        setModelAnalytics(modelData);
        setRecentCalls(calls.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  // Stats Cards

  const statsCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total API Calls",
        value: stats.totalCalls.toLocaleString(),
        icon: <Activity className="h-5 w-5" />,
        color: "blue" as const,
      },
      {
        title: "Total Tokens",
        value: stats.totalTokens.toLocaleString(),
        icon: <Zap className="h-5 w-5" />,
        color: "purple" as const,
      },
      {
        title: "Total Cost",
        value: `$${stats.totalCost.toFixed(2)}`,
        icon: <DollarSign className="h-5 w-5" />,
        color: "green" as const,
      },
      {
        title: "Avg Response Time",
        value: `${Math.round(stats.avgResponseTime)}ms`,
        icon: <Clock className="h-5 w-5" />,
        color: "orange" as const,
      },
    ];
  }, [stats]);

  const getSuccessRateColor = useCallback((rate: number) => {
    if (rate >= 95)
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (rate >= 80)
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }, []);
  // Loading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
        <CardListSkeleton count={4} />
        <ChartSkeleton />
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }
  // Render

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track AI usage, costs, and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border ${
                  card.color === "blue"
                    ? "bg-blue-50 text-blue-500"
                    : card.color === "purple"
                      ? "bg-purple-50 text-purple-500"
                      : card.color === "green"
                        ? "bg-green-50 text-green-500"
                        : "bg-orange-50 text-orange-500"
                }`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Analytics */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-primary-500" />
          Provider Analytics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-muted-foreground">
                  Provider
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Calls
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Tokens
                </th>
                <th className="pb-2 font-medium text-muted-foreground">Cost</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Avg Latency
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {providerAnalytics.map((provider) => (
                <tr
                  key={provider.providerId}
                  className="border-b border-border/50"
                >
                  <td className="py-2 font-medium">{provider.providerName}</td>
                  <td className="py-2">{provider.calls}</td>
                  <td className="py-2">
                    {provider.totalTokens.toLocaleString()}
                  </td>
                  <td className="py-2">${provider.totalCost.toFixed(2)}</td>
                  <td className="py-2">
                    {Math.round(provider.avgResponseTime)}ms
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getSuccessRateColor(provider.successRate)}`}
                    >
                      {provider.successRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Analytics */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary-500" />
          Model Analytics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-muted-foreground">
                  Model
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Calls
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Tokens
                </th>
                <th className="pb-2 font-medium text-muted-foreground">Cost</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Avg Latency
                </th>
              </tr>
            </thead>
            <tbody>
              {modelAnalytics.map((model) => (
                <tr key={model.model} className="border-b border-border/50">
                  <td className="py-2 font-medium">{model.model}</td>
                  <td className="py-2">{model.calls}</td>
                  <td className="py-2">{model.totalTokens.toLocaleString()}</td>
                  <td className="py-2">${model.totalCost.toFixed(2)}</td>
                  <td className="py-2">
                    {Math.round(model.avgResponseTime)}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent API Calls */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-500" />
          Recent API Calls
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium text-muted-foreground">Time</th>
                <th className="pb-2 font-medium text-muted-foreground">Team</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Provider
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Model
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Tokens
                </th>
                <th className="pb-2 font-medium text-muted-foreground">Cost</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr key={call.id} className="border-b border-border/50">
                  <td className="py-2 text-muted-foreground text-xs">
                    {new Date(call.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2">{call.teamName}</td>
                  <td className="py-2">{call.providerName}</td>
                  <td className="py-2">{call.model}</td>
                  <td className="py-2">{call.totalTokens.toLocaleString()}</td>
                  <td className="py-2">${call.cost.toFixed(4)}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        call.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : call.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
