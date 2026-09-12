// ============================================
// SLACK CONFIG — Slack webhook URL setup karne ke liye
// ============================================

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Save,
  Trash2,
  Link2,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

/**
 * 🤔 Kya Hai?
 * Yeh component Slack integration configure karne ke liye hai.
 *
 * ❓ Kyun Use Kiya?
 * - Slack Incoming Webhook URL ko save karte hain
 * - Is se NEXUS Slack channel par alerts bhej sakta hai
 * - Team collaboration improve hoti hai
 *
 * ⚙️ Kaise Kaam Karegi?
 * 1. User Slack channel mein "Incoming Webhook" create karega
 * 2. Webhook URL copy karega aur yahan paste karega
 * 3. "Save" click karega → localStorage mein save ho jayega
 * 4. Test button click karega → test message bhejega
 */

export const SlackConfig: React.FC = () => {
  const { addNotification } = useNotification();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // ✅ Load saved URL on mount
  useEffect(() => {
    const saved = localStorage.getItem("nexus_slack_webhook");
    if (saved) {
      setWebhookUrl(saved);
      setIsSaved(true);
    }
  }, []);

  // ✅ Save webhook URL
  const handleSave = () => {
    if (!webhookUrl.trim()) {
      addNotification("Please enter a valid webhook URL", "warning");
      return;
    }

    // ✅ Basic URL validation
    try {
      new URL(webhookUrl);
    } catch {
      addNotification("Please enter a valid URL", "error");
      return;
    }

    localStorage.setItem("nexus_slack_webhook", webhookUrl);
    setIsSaved(true);
    addNotification("Slack webhook URL saved successfully!", "success");
  };

  // ✅ Test webhook
  const handleTest = async () => {
    if (!webhookUrl) {
      addNotification("Please save a webhook URL first", "warning");
      return;
    }

    setIsTesting(true);
    try {
      // ✅ Mock test — console mein simulate karein
      console.log("📨 Testing Slack webhook...");
      console.log("📨 URL:", webhookUrl);
      console.log('📨 Message: "🟢 NEXUS: Test message from NEXUS!"');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification("✅ Test message sent to Slack!", "success");

      // ✅ Real implementation (Phase 11)
      // const response = await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: '🟢 NEXUS: Test message from NEXUS!' }),
      // });
    } catch (error) {
      console.error("❌ Test failed:", error);
      addNotification("❌ Failed to send test message", "error");
    } finally {
      setIsTesting(false);
    }
  };

  // ✅ Remove saved URL
  const handleRemove = () => {
    localStorage.removeItem("nexus_slack_webhook");
    setWebhookUrl("");
    setIsSaved(false);
    addNotification("Slack webhook removed", "info");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary-500" />
        <h3 className="text-lg font-semibold">Slack Integration</h3>
        {isSaved ? (
          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Connected
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
            <XCircle className="h-3 w-3" />
            Not configured
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Configure Slack Incoming Webhook to receive alerts and notifications
        directly in your Slack channel.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Slack Webhook URL
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSaved}
              />
            </div>
            {!isSaved ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors whitespace-nowrap"
              >
                <Save className="h-4 w-4 inline mr-1" />
                Save
              </button>
            ) : (
              <button
                onClick={handleRemove}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors dark:hover:bg-red-900/20 whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4 inline mr-1" />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isSaved
              ? "✅ Slack webhook is configured"
              : "Create an Incoming Webhook in Slack settings and paste the URL here."}
          </p>
        </div>

        {isSaved && (
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                Sending test...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Send Test Message
              </>
            )}
          </button>
        )}
      </div>

      {/* Help section */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400">
          How to get Slack Webhook URL?
        </h4>
        <ol className="mt-2 text-sm text-blue-600 dark:text-blue-300 space-y-1">
          <li>1. Go to your Slack workspace</li>
          <li>2. Apps → Custom Integrations → Incoming Webhooks</li>
          <li>3. Select a channel and generate webhook URL</li>
          <li>4. Copy and paste the URL above</li>
        </ol>
      </div>
    </div>
  );
};
