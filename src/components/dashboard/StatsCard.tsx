import React, { memo, ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal" | "indigo";
  loading?: boolean;
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  green: "bg-green-500/10 border-green-500/20 text-green-500",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-500",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-500",
  red: "bg-red-500/10 border-red-500/20 text-red-500",
  teal: "bg-teal-500/10 border-teal-500/20 text-teal-500",
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500",
};

export const StatsCard: React.FC<StatsCardProps> = memo(
  ({ title, value, change, icon, color = "blue", loading = false }) => {
    const isPositive = change?.startsWith("+");

    if (loading) {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className={`p-2.5 rounded-lg border ${colorClasses[color]}`}>
            {icon}
          </div>
          {change && (
            <span
              className={`text-sm font-medium ${
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {change}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold mt-3 text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      </div>
    );
  },
);

StatsCard.displayName = "StatsCard";
