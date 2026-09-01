import React from "react";
import { ProviderHealth } from "../../types";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  RefreshCw,
} from "lucide-react";

interface HealthCardProps {
  health: ProviderHealth;
  onCheck: (providerId: string) => void;
  isChecking: boolean;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  health,
  onCheck,
  isChecking,
}) => {
  const getStatusIcon = () => {
    switch (health.status) {
      case "healthy":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "unhealthy":
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (health.status) {
      case "healthy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "degraded":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "unhealthy":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getBorderColor = () => {
    switch (health.status) {
      case "healthy":
        return "border-green-200 dark:border-green-800";

      case "degraded":
        return "border-yellow-200 dark:border-yellow-800";

      case "unhealthy":
        return "border-red-200 dark:border-red-800";

      default:
        return "border-border";
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

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border ${getBorderColor()} p-6 card-hover`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
            <span className="text-xl">{health.providerName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold">{health.providerName}</h3>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge()}`}
            >
              {health.status}
            </span>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Response Time</span>
          <span className="font-medium">{health.responseTime}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Success Rate</span>
          <span className="font-medium">{health.successRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Uptime</span>
          <span className="font-medium">{health.uptime.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Circuit Breaker</span>
          <span
            className={`font-medium ${health.isCircuitOpen ? "text-red-500" : "text-green-500"}`}
          >
            {health.isCircuitOpen ? "Open" : "Closed"}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Failovers: {health.failoverCount}</span>
          <span>Last checked: {formatTime(health.lastCheck)}</span>
        </div>
      </div>

      <button
        onClick={() => onCheck(health.providerId)}
        disabled={isChecking}
        className="mt-4 w-full px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 disabled:opacity-50"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 inline mr-1.5 ${isChecking ? "animate-spin" : ""}`}
        />
        Run Health Check
      </button>
    </div>
  );
};
