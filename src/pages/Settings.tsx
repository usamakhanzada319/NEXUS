import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  Settings as SettingsIcon,
  MessageSquare,
  Webhook,
  Download,
  Bell,
} from "lucide-react";
import { SlackConfig } from "../components/integrations/SlackConfig";
import { WebhookConfig } from "../components/integrations/WebhookConfig";
import { ExportButton } from "../components/integrations/ExportButton";

export const Settings: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "slack" | "webhooks" | "export" | "notifications"
  >("slack");

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  const tabs = [
    { id: "slack", label: "Slack", icon: MessageSquare },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "export", label: "Export", icon: Download },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 ">
          <SettingsIcon className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure integrations and system settings
        </p>
      </div>
      {/* Tabs */}

      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-900 shadow-sm text-primary-600 dark:text-primary-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      {/* contant */}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 ">
        {activeTab === "slack" && <SlackConfig />}
        {activeTab === "webhooks" && <WebhookConfig />}
        {activeTab === "export" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Download className="h-5 w-5 text-primary-500" />
              Data Export
            </h3>
            <p className="text-sm text-muted-foreground">
              Export data in CSV or JSON format for analysis and reporting.
            </p>
            <div className="flex flex-wrap gap-4">
              <ExportButton
                data={[
                  {
                    id: 1,
                    name: "Alpha Squad",
                    spend: 4850.5,
                    status: "Active",
                  },
                  { id: 2, name: "Beta Team", spend: 2100.0, status: "Active" },
                  {
                    id: 3,
                    name: "Gamma Group",
                    spend: 1250.0,
                    status: "Inactive",
                  },
                ]}
                fileName="nexus-teams-export"
                label="Export Teams"
                format="both"
              />
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-500" />
              Notifications
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure notification preferences and alert channels.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Send alerts when budget limits are reached
                  </p>
                </div>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  Enabled
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Anomaly Detection</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when anomalies are detected
                  </p>
                </div>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  Enabled
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
