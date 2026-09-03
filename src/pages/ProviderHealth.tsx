import { useAuth } from "../context/AuthContext";
import { useProviderHealth } from "../hooks/useProviderHealth";
import { HealthCard } from "../components/provider/HealthCard";
import { CircuitBreaker } from "../components/provider/CircuitBreaker";
import { RefreshCw, Shield, Server } from "lucide-react";
import React from "react";

export const ProviderHealth: React.FC = () => {
  const { isAdmin } = useAuth();

  const {
    healthData,
    fallbackConfigs,
    isLoading,
    isChecking,
    refreshHealth,
    runHealthCheck,
    toggleFallback,
  } = useProviderHealth();

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
          Loading provider health...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Provider Health</h1>
          <p className="text-muted-foreground">
            Monitor provider status and configure fallback
          </p>
        </div>
        <button
          onClick={refreshHealth}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh All
        </button>
      </div>

      {/* Health card */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthData.map((health) => (
          <HealthCard
            key={health.providerId}
            health={health}
            onCheck={refreshHealth}
            isChecking={isChecking}
          />
        ))}
      </div>

      {/* Circuit Breaker Status */}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary-500" />
          Circuit Breaker Status
        </h2>
        <div className="space-y-3">
          {healthData.map((health) => (
            <CircuitBreaker
              key={health.providerId}
              health={health}
              onToggle={toggleFallback}
              showToggle={true}
            />
          ))}
        </div>
      </div>

      {/* Fallback Configuration */}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-primary-500" />
          Fallback Configuration
        </h2>
        <div className="space-y-2">
          {fallbackConfigs.map((config) => {
            const provider = healthData.find(
              (h) => h.providerId === config.providerId,
            );
            const fallback = healthData.find(
              (h) => h.providerId === config.fallbackProviderId,
            );
            return (
              <div
                key={config.providerId}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium">
                    {provider?.providerName || config.providerId}
                  </span>
                  <span className="text-muted-foreground mx-2">→</span>
                  <span className="font-medium">
                    {fallback?.providerName || config.fallbackProviderId}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Max RT:{config.triggerConditions.maxResponseTime}ms
                  </span>
                  <span>
                    Min Success: {config.triggerConditions.minSuccessRate}%
                  </span>
                  <span>
                    Failures: {config.triggerConditions.consecutiveFailures}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    config.enabled
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {config.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
