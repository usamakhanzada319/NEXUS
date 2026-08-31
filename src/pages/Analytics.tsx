import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import {
  Activity,
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Server,
  BarChart,
  PieChart,
  Table,
} from "lucide-react";

import {
  APICallLog,
  ProviderAnalytics,
  ModelAnalytics,
  AnalyticsStats,
} from "../types";

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

  if (!isAdmin) {
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
          Loading analytics...
        </div>
      </div>
    );
  }

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
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalCalls || 0}</p>
              <p className="text-sm text-muted-foreground">Total API Calls</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats?.totalTokens.toLocaleString() || 0}
              </p>
              <p className="text-sm text-muted-foreground"> Total Tokens</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${stats?.totalCost?.toFixed(2) || "0.00"}
              </p>
              <p className="text-sm text-muted-foreground">Total Cost</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(stats?.avgResponseTime || 0)}ms
              </p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
          </div>
        </div>
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
                  className="border-b border-border/50 "
                >
                  <td className="py-2 font-medium">{provider.providerName}</td>
                  <td className="py-2">{provider.calls}</td>
                  <td className="py-2">
                    {provider.totalTokens.toLocaleString()}
                  </td>
                  <td className="py-2">{provider.totalCost.toFixed(2)}</td>
                  <td className="py-2">
                    {Math.round(provider.avgResponseTime)}ms
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs
                        ${
                          provider.successRate >= 95
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : provider.successRate >= 80
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
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
                  calls
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
                  <td className="py-2">{model.totalCost.toFixed(2)}</td>
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
          <Table className="h-5 w-5 text-primary-500" />
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
                    {new Date(call.createdAt).toISOString()}
                  </td>
                  <td className="py-2">{call.teamName}</td>
                  <td className="py-2">{call.providerName}</td>
                  <td className="py-2">{call.model}</td>
                  <td className="py-2">{call.totalTokens.toLocaleString()}</td>
                  <td className="py-2">{call.cost.toFixed(4)}</td>
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
