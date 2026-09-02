import { useState, useEffect, useCallback, use } from 'react';
import { apiClient } from '../api/client';
import { useNotification } from '../context/NotificationContext';
import { ProviderHealth, ProviderFallbackConfig, HealthCheckResult } from "../types";

interface useProviderHealthReturn {
    healthData: ProviderHealth[];
    fallbackConfigs: ProviderFallbackConfig[];
    isLoading: boolean;
    isChecking: boolean;
    refreshHealth: () => Promise<void>;
    runHealthCheck: (ProviderId: string) => Promise<HealthCheckResult | undefined>;
    toggleFallback: (ProviderId: string) => Promise<void>
    updateHealth: (ProviderId: string, updates: Partial<ProviderHealth>) => Promise<void>
}


export const useProviderHealthReturn = (): useProviderHealthReturn => {
    const { addNotification } = useNotification();
    const [healthData, setHealthData] = useState<ProviderHealth[]>([]);
    const [fallbackConfigs, setFallbackConfigs] = useState<ProviderFallbackConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const refreshHealth = useCallback(async () => {
        setIsLoading(true)

        try {
            const [health, config] = await Promise.all([
                apiClient.getProviderHealth(),
                apiClient.getFallbackConfigs(),
            ])
            setHealthData(health);
            setFallbackConfigs(config);

        } catch (error) {
            console.error('Failed to fetch health data:', error);
            addNotification('Failed to fetch provider health data', 'error');

        } finally {
            setIsLoading(false)
        }
    }, [addNotification])


    const runHealthCheck = useCallback(async (providerId: string) => {
        setIsLoading(true);
        try {
            const result = await apiClient.runHealthCheck(providerId);
            await refreshHealth()

            if (result.success) {
                addNotification(`Health check passed for ${result.providerId}`, 'success')
            } else {
                addNotification(`Health check failed for ${result.providerId}`, 'error');

            }
            return result

        } catch (error) {
            console.error('Failed to run health check:', error);
            addNotification('Failed to run health check', 'error');
            return undefined;
        } finally {
            setIsLoading(false)
        }
    }, [refreshHealth, addNotification])

    const toggleFallback = useCallback(async (providerId: string) => {
        try {
            const config = fallbackConfigs.find(c => c.providerId === providerId)
            if (config) {
                const updated = await apiClient.updateFallbackConfig(providerId, {
                    enabled: !config.enabled
                });

                if (updated) {
                    setFallbackConfigs((prev) => prev.map(c => c.providerId === providerId ? updated : c));
                    addNotification(
                        `Fallback ${updated.enabled ? 'enabled' : 'disabled'} for ${providerId}`,
                        'success'
                    );
                }
            }

        } catch (error) {
            console.error('Failed to toggle fallback:', error);
            addNotification('Failed to toggle fallback', 'error');

        }
    }, [fallbackConfigs, addNotification])


    const updateHealth = useCallback(async (providerId: string, updates: Partial<ProviderHealth>) => {
        try {

            const updated = await apiClient.updateProviderHealth(providerId, updates);

            if (updated) {
                setHealthData((prev) => prev.map(h => h.providerId === providerId ? updated : h))
            }


        } catch (error) {
            console.error('Failed to update health:', error);
            addNotification('Failed to update provider health', 'error');
        }
    }, [addNotification]);

    useEffect(() => {
        refreshHealth();
    }, [refreshHealth]);

    return {
        healthData,
        fallbackConfigs,
        isLoading,
        isChecking,
        refreshHealth,
        runHealthCheck,
        toggleFallback,
        updateHealth,
    };
}