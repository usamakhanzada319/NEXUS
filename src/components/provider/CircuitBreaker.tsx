import React from "react";
import { ProviderHealth } from "../../types";
import { Power, PowerOff, AlertTriangle, Shield } from "lucide-react";

interface CircuitBreakerProps {
  health: ProviderHealth;
  onToggle?: (ProviderId: string) => void;
  showToggle?: boolean;
}

export const CircuitBreaker: React.FC<CircuitBreakerProps> = ({
  health,
  onToggle,
  showToggle = false,
}) => {
  const isOpen = health.isCircuitOpen;
  const isHealthy = health.status === "healthy";

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Circuit Breaker</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isOpen
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {isOpen ? (
            <>
              <PowerOff className="h-3 w-3" />
              Open
            </>
          ) : (
            <>
              <Power className="h-3 w-3" />
              Closed
            </>
          )}
        </div>

        {!isOpen && isHealthy && (
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Normal
          </span>
        )}

        {!isOpen && !isHealthy && (
          <span className="text-xs text-yellow-500 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Degraded
          </span>
        )}
        {isOpen && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Blocked
          </span>
        )}
      </div>

      {showToggle && onToggle && (
        <button
          onClick={() => onToggle(health.providerId)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
            isOpen
              ? "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {isOpen ? "Reset" : "Force Open"}
        </button>
      )}
    </div>
  );
};
