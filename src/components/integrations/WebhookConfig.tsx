// webhook config => for  setup External webhook

import React, { useState, useEffect } from "react";
import {
  Webhook,
  Plus,
  Trash2,
  Save,
  X,
  Link2,
  Zap,
  XCircle,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

interface WebhookConfigItem {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

const eventOptions = [
  { value: "budget_alert", label: "Budget Alert" },
  { value: "anomaly", label: "Anomaly Detected" },
  { value: "invoice_paid", label: "Invoice Paid" },
  { value: "provider_status", label: "Provider Status Change" },
  { value: "team_created", label: "Team Created" },
];

export const WebhookConfig: React.FC = () => {
  const { addNotification } = useNotification();
  const [webhooks, setWebhooks] = useState<WebhookConfigItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);

  //   Load saved webhooks
  useEffect(() => {
    const saved = localStorage.getItem("nexus_webhooks");
    if (saved) {
      try {
        setWebhooks(JSON.parse(saved));
      } catch (error) {
        setWebhooks([]);
      }
    }
  }, []);

  //   save to localStorage
  const saveWebhooks = (data: WebhookConfigItem[]) => {
    localStorage.setItem("nexus_webhooks", JSON.stringify(data));
    setWebhooks(data);
  };

  //   Add Webhook
  const handleAdd = () => {
    if (!newUrl.trim()) {
      addNotification("Please enter a webhook URL", "warning");
      return;
    }

    try {
      new URL(newUrl);
    } catch (error) {
      addNotification("Please enter a valid URL", "error");
      return;
    }
    if (newEvents.length === 0) {
      addNotification("Please select at least one event", "warning");
      return;
    }
    const newWebhook: WebhookConfigItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      url: newUrl,
      events: newEvents,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setWebhooks([...webhooks, newWebhook]);
    setNewUrl("");
    setNewEvents([]);
    setShowAddForm(false);
    addNotification("Webhook added successfully!", "success");
  };

  //   remove webhook

  const handleRemove = (id: string) => {
    if (!confirm("Remove this webhook?")) return;
    saveWebhooks(webhooks.filter((w) => w.id !== id));
    addNotification("Webhook removed", "info");
  };

  //   Toggle webhook
  const handleToggle = (id: string) => {
    saveWebhooks(
      webhooks.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)),
    );
    addNotification("Webhook updated", "success");
  };
  // Toggle event selection

  const toggleEvent = (event: string) => {
    setNewEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Webhooks</h3>

          <span className="text-xs text-muted-foreground">
            ({webhooks.length} configured)
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Webhook
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Send events to external systems via webhooks. Supports Zapier, Make,
        custom APIs, and more.
      </p>
      {/* Add Webhook Form */}

      {showAddForm && (
        <div className="p-4 border border-border rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">New Webhook</h4>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Webhook URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Events</label>
            <div className="flex flex-wrap gap-2">
              {eventOptions.map((event) => (
                <button
                  key={event.value}
                  onClick={() => toggleEvent(event.value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    newEvents.includes(event.value)
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {event.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Save Webhook
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Webhook List */}
      {webhooks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Webhook className="h-12 w-12 mx-auto opacity-50" />
          <p className="mt-2">No webhooks configured</p>
          <p className="text-sm">
            Add a webhook to integrate with external systems
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className={`flex items-center justify-between p-3 border rounded-lg transition-colors 
                ${
                  webhook.isActive
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-border bg-gray-50 dark:bg-gray-800/50"
                }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {webhook.isActive ? (
                    <Zap className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-medium truncate">{webhook.url}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full"
                    >
                      {eventOptions.find((e) => e.value === event)?.label ||
                        event}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {new Date(webhook.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggle(webhook.id)}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    webhook.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {webhook.isActive ? "Active" : "Inactive"}
                </button>
                <button onClick={() => handleRemove(webhook.id)}></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
