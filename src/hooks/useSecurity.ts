import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { MFAConfig } from '../types';
import { useNotification } from '../context/NotificationContext';


interface useSecurityReturn {
    mfaConfig: MFAConfig | undefined;
    isLoading: boolean;
    refreshSecurity: () => Promise<void>
}

export const useSecurity = (): useSecurityReturn => {
    const { addNotification } = useNotification()
    const [mfaConfig, setMfaConfig] = useState<MFAConfig | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    const refreshSecurity = useCallback(async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem('nexus_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const config = await apiClient.getMFAConfig(user.id)
                setMfaConfig(config)
            }

        } catch (error) {
            console.error('Failed to refresh security:', error);
            addNotification('Failed to refresh security settings', 'error');

        } finally {
            setIsLoading(false)
        }
    }, [addNotification])

    useEffect(() => {
        refreshSecurity();
    }, [refreshSecurity]);

    return {
        mfaConfig,
        refreshSecurity,
        isLoading
    }
}