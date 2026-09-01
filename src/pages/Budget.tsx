import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { TeamBudget, BudgetAlert } from "../types";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap,
  RefreshCw,
} from "lucide-react";

export const Budget: React.FC = () => {
  const { isAdmin } = useAuth();
  const [budgets, setBudgets] = useState<TeamBudget[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      setIsLoading(true);
      try {
        const [budgetsData, alertsData] = await Promise.all([
          apiClient.getBudgets(),
          apiClient.getUnresolvedBudgetAlerts(),
        ]);
        setBudgets(budgetsData);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleUpdateBudget = async (
    teamId: string,
    updates: Partial<TeamBudget>,
  ) => {
    try {
      const updated = await apiClient.updateBudget(teamId, updates);
      if (updated) {
        setBudgets((prev) =>
          prev.map((b) => (b.teamId === teamId ? updated : b)),
        );
        // Refresh alerts
        const alertsData = await apiClient.getUnresolvedBudgetAlerts();
        setAlerts(alertsData);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await apiClient.resolveBudgetAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

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
          Loading budgets...
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpend = budgets.reduce((sum, b) => sum + b.currentMonthSpend, 0);
  const overallPercent = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <p className="text-muted-foreground">Track and manage team budgets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${totalBudget.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Budget</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ${totalSpend.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Spend</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(overallPercent)}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Usage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            Budget Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      alert.type === "hard"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {alert.type === "hard" ? "HARD LIMIT" : "SOFT LIMIT"}
                  </span>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => {
          const spendPercent =
            (budget.currentMonthSpend / budget.monthlyLimit) * 100;
          const isOverSoft = spendPercent >= budget.softLimitPercent;
          const isOverHard = spendPercent >= budget.hardLimitPercent;

          return (
            <div
              key={budget.teamId}
              className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{budget.teamName}</h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    isOverHard
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : isOverSoft
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {isOverHard ? "Blocked" : isOverSoft ? "Alert" : "Active"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Monthly Budget
                    </span>
                    <span className="font-medium">
                      ${budget.monthlyLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isOverHard
                          ? "bg-red-500"
                          : isOverSoft
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(spendPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>
                      ${budget.currentMonthSpend.toLocaleString()} spent
                    </span>
                    <span>{Math.round(spendPercent)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <div>
                    <p className="text-muted-foreground">Daily Limit</p>
                    <p className="font-medium">${budget.dailyLimit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Today</p>
                    <p className="font-medium">${budget.currentDaySpend}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
