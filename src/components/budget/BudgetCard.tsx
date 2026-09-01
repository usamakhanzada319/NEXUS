import React, { useState } from "react";
import { TeamBudget } from "../../types";
import { Edit2, Save } from "lucide-react";

interface BudgetCardProps {
  budget: TeamBudget;
  onUpdate: (teamId: string, updates: Partial<TeamBudget>) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState(budget.monthlyLimit);
  const [dailyLimit, setDailyLimit] = useState(budget.dailyLimit);
  const [softLimitPercent, setSoftLimitPercent] = useState(
    budget.softLimitPercent,
  );
  const [hardLimitPercent, setHardLimitPercent] = useState(
    budget.hardLimitPercent,
  );

  const spendPercent = (budget.currentMonthSpend / budget.monthlyLimit) * 100;
  const isOverSoft = spendPercent >= budget.softLimitPercent;
  const isOverHard = spendPercent >= budget.hardLimitPercent;

  const handleSave = () => {
    onUpdate(budget.teamId, {
      monthlyLimit,
      dailyLimit,
      softLimitPercent,
      hardLimitPercent,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMonthlyLimit(budget.monthlyLimit);
    setDailyLimit(budget.dailyLimit);
    setSoftLimitPercent(budget.softLimitPercent);
    setHardLimitPercent(budget.hardLimitPercent);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{budget.teamName}</h3>
          <p className="text-xs text-muted-foreground">Budget Overview</p>
        </div>
        <div className="flex items-center gap-2">
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
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
              aria-label="Edit budget"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {/* content */}

      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Budget</span>
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
            <span>${budget.currentMonthSpend.toLocaleString()} spent</span>
            <span>{Math.round(spendPercent)}%</span>
          </div>
        </div>
        {/* Daily Limit & Today */}

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
        {/* Edit Mode */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Daily Limit ($)
                </label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                  step="50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Soft Limit (%)
                </label>
                <input
                  type="number"
                  value={softLimitPercent}
                  onChange={(e) => setSoftLimitPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Hard Limit (%)
                </label>
                <input
                  type="number"
                  value={hardLimitPercent}
                  onChange={(e) => setHardLimitPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
