import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { LoginHistory as LoginHistoryType } from "../../types";
import { History, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface LoginHistoryProps {
  userId: string;
}

export const LoginHistory: React.FC<LoginHistoryProps> = ({ userId }) => {
  const [history, setHistory] = useState<LoginHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getLoginHistory(userId);
      setHistory(data.slice(0, 20));
    } catch (error) {
      console.error("Failed to load login history:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading login history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-2">
          No login history available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary-500" />
          <span className="font-medium">Login History</span>
          <span className="text-xs text-muted-foreground">
            (Last 20 entries)
          </span>
        </div>
        <button
          onClick={loadHistory}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 font-medium text-muted-foreground">Time</th>
              <th className="pb-2 font-medium text-muted-foreground">Device</th>
              <th className="pb-2 font-medium text-muted-foreground">IP</th>
              <th className="pb-2 font-medium text-muted-foreground">
                Location
              </th>
              <th className="pb-2 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-2 text-muted-foreground whitespace-nowrap">
                  {formatTime(entry.createdAt)}
                </td>
                <td className="py-2">
                  <div>
                    <p className="font-medium">{entry.deviceName}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.browser} · {entry.os}
                    </p>
                  </div>
                </td>
                <td className="py-2 font-mono text-xs">{entry.ip}</td>
                <td className="py-2 text-muted-foreground">
                  {entry.location || "Unknown"}
                </td>
                <td className="py-2">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                      entry.status
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {entry.status === "success" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {entry.status}
                  </span>
                  {entry.failedReason && (
                    <p className="text-xs text-red-500 mt-1">
                      {entry.failedReason}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
