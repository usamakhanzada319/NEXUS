import React from "react";
import { useAuth } from "../context/AuthContext";
import { useBudget } from "../context/BudgetContext";
import { BudgetCard } from "../components/budget/BudgetCard";
import { BudgetAlertComponent } from "../components/budget/BudgetAlert";
import { DollarSign, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

export const Budget: React.FC = () => {
  const { isAdmin } = useAuth();
  const {
    budgets,
    alerts,
    isLoading,
    refreshBudgets,
    updateBudget,
    resolveAlert,
    totalBudget,
    totalSpend,
    overallPercent,
  } = useBudget();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Track and manage team budgets</p>
        </div>
        <button
          onClick={refreshBudgets}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
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
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5" />
            Budget Alerts ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <BudgetAlertComponent
                key={alert.id}
                alert={alert}
                onResolve={resolveAlert}
              />
            ))}
          </div>
        </div>
      )}
      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.teamId}
            budget={budget}
            onUpdate={updateBudget}
          />
        ))}
      </div>
    </div>
  );
};
