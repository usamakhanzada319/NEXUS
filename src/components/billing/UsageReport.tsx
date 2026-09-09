import React, { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { UsageReport as UsageReportType } from "../../types";
import { BarChart3, RefreshCw } from "lucide-react";

interface UsageReportProps {
  teamId: string;
}

export const UsageReport: React.FC<UsageReportProps> = ({ teamId }) => {
  const [report, setReport] = useState<UsageReportType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [teamId]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const periodStart = new Date();
      periodStart.setMonth(periodStart.getMonth() - 1);
      const periodEnd = new Date();
      const data = await apiClient.getUsageReport(
        teamId,
        periodStart.toISOString(),
        periodEnd.toISOString(),
      );
      setReport(data || null);
    } catch (error) {
      console.error("Failed to load usage report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading usage report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-2">No usage report available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary-500" />
          <span className="font-medium">Usage Report</span>
          <span className="text-sm text-muted-foreground">
            {new Date(report.periodStart).toLocaleDateString()} -
            {new Date(report.periodEnd).toLocaleDateString()}
          </span>
        </div>
        <button
          onClick={loadReport}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-xl font-bold">
            {formatCurrency(report.totalCost)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Tokens</p>
          <p className="text-xl font-bold">
            {report.totalTokens.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total API Calls</p>
          <p className="text-xl font-bold">{report.totalCalls}</p>
        </div>
      </div>

      {/* By Provider */}
      <div>
        <h3 className="text-sm font-medium mb-2 ">By Provider</h3>
        <div className="space-y-2">
          {report?.byProvider.map((provider) => (
            <div
              key={provider.providerId}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{provider.providerName}</p>
                <p className="text-sm text-muted-foreground">
                  {provider.calls} calls . {provider.tokens.toLocaleString()}
                  tokens
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(provider.cost)}</p>
                <p className="text-sm text-muted-foreground">
                  {((provider.cost / report.totalCost) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* By Modle */}
      <div>
        <h3 className="text-sm font-medium mb-2">By Model</h3>
        <div className="space-y-2">
          {report?.byModel.map((model) => (
            <div
              key={model.model}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{model.model}</p>
                <p className="text-sm text-muted-foreground">
                  {model.calls} . {model.tokens.toLocaleString()} tokens
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(model.cost)}</p>
                <p className="text-sm text-muted-foreground">
                  {((model.cost / report.totalCost) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Daily Breakdown */}
      <div>
        <h3 className="text-sm font-medium mb-2 ">Daily Breakdown</h3>
        <div className="overflow-auto">
          <table className=" w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-1 font-medium text-muted-foreground">Date</th>
                <th className="pb-1 font-medium text-muted-foreground">Cost</th>
                <th className="pb-1 font-medium text-muted-foreground">
                  Tokens
                </th>
                <th className="pb-1 font-medium text-muted-foreground">
                  Calls
                </th>
              </tr>
            </thead>
            <tbody>
              {report?.byDay.map((day, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-1.5">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="py-1.5">{formatCurrency(day.cost)}</td>
                  <td className="py-1.5">{day.tokens.toLocaleString()}</td>
                  <td className="py-1.5">{day.calls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
