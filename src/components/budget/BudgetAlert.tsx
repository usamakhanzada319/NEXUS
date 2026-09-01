import React from "react";
import { BudgetAlert } from "../../types";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

interface BudgetAlertProps {
  alert: BudgetAlert;
  onResolve: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const BudgetAlertComponent: React.FC<BudgetAlertProps> = ({
  alert,
  onResolve,
  onDismiss,
}) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case "hard":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "soft":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "daily":
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case "hard":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20";
      case "soft":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
      case "daily":
        return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20";
    }
  };

  const getTypeLabel = () => {
    switch (alert.type) {
      case "hard":
        return "HARD LIMIT";
      case "soft":
        return "SOFT LIMIT";
      case "daily":
        return "DAILY LIMIT";
      default:
        return "ALERT";
    }
  };

  const getTypeColor = () => {
    switch (alert.type) {
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "soft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "daily":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  <div
    className={`flex items-center justify-between p-4 rounded-lg border ${getAlertColor()}`}
  >
    <div className="flex items-start gap-3 flex-1">
      <div className="mt-0.5">{getAlertIcon()}</div>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor()}`}
          >
            {getTypeLabel()}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {alert.teamName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(alert.triggeredAt)}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {alert.message}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 ml-4">
      {!alert.isResolved && (
        <button
          onClick={() => onResolve(alert.id)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-green-400 dark:hover:bg-green-900/20"
        >
          <CheckCircle className="h-4 w-4" />
          Resolve
        </button>
      )}

      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="Dismiss alert"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>;
};
