import React, { useEffect, useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { apiClient } from "../../api/client";

import { Key, RefreshCw, CheckCircle, Copy } from "lucide-react";

interface backupCodesProps {
  userId: string;
}

export const backupCodes: React.FC<backupCodesProps> = ({ userId }) => {
  const { addNotification } = useNotification();

  const [codes, setCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    loadBackupCodes();
  }, [userId]);

  const loadBackupCodes = async () => {
    setIsLoading(true);
    try {
      const config = await apiClient.getMFAConfig(userId);
      if (config && config.backupCodes) {
        setCodes(config.backupCodes);
      }
    } catch (error) {
      console.error("Failed to load backup codes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (
      !confirm(
        "Regenerating backup codes will invalidate all previous codes. Continue?",
      )
    ) {
      return;
    }
    setIsRegenerating(true);

    try {
      const newCode = await apiClient.regenerateBackupCodes(userId);
      setCodes(newCode);
      addNotification("Backup codes regenerated successfully!", "success");
    } catch (error) {
      console.error("Failed to regenerate backup codes:", error);
      addNotification("Failed to regenerate backup codes", "error");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    addNotification("Backup codes copied to clipboard!", "success");
  };
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading backup codes...
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="text-center py-8">
        <Key className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-2">No backup codes available.</p>
        <p className="text-sm text-muted-foreground">
          Enable MFA first to generate backup codes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary-500" />
          <span className="font-medium">Your Backup Codes</span>
          <span className="text-xs text-muted-foreground">
            (Keep these safe!)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating" : "Regenerate"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {codes.map((code, index) => (
          <div
            key={index}
            className="flex items-center justify-between font-mono text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border border-border"
          >
            <span>{code}</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        ))}
      </div>
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          Store these backup codes in a safe place. Each code can only be used
          once. If you lose them, you can regenerate new ones
        </p>
      </div>
    </div>
  );
};
