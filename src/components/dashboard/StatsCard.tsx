import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
}) => {
  const isPositive = change?.startsWith("+");
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span
            className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-4">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
    </div>
  );
};
