import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { useNotification } from "../../context/NotificationContext";
import { PasswordPolicy as PasswordPolicyType } from "../../types";
import { Lock, Save, } from "lucide-react";

export const PasswordPolicy: React.FC = () => {
  const { addNotification } = useNotification();
  const [policy, setPolicy] = useState<PasswordPolicyType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<PasswordPolicyType | null>(null);

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getPasswordPolicy();
      setPolicy(data);
      setEditing(data);
    } catch (error) {
      console.error("Failed to load password policy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setIsSaving(true);

    try {
      await apiClient.updatePasswordPolicy(editing);
      setPolicy(editing);
      addNotification("Password policy updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update password policy:", error);
      addNotification("Failed to update password policy", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof PasswordPolicyType, value: any) => {
    if (!editing) return;
    setEditing({
      ...editing,
      [key]: value,
    });
  };
  const requirements = [
    {
      key: "minLength",
      label: "Minimum length",
      type: "number",
      min: 6,
      max: 20,
    },
    {
      key: "requireUppercase",
      label: "Require uppercase letter",
      type: "boolean",
    },
    {
      key: "requireLowercase",
      label: "Require lowercase letter",
      type: "boolean",
    },
    { key: "requireNumber", label: "Require number", type: "boolean" },

    {
      key: "requireSpecialChar",
      label: "Require special character",
      type: "boolean",
    },
    {
      key: "maxAgeDays",
      label: "Password expiry (days)",
      type: "number",
      min: 0,
      max: 365,
    },
    {
      key: "preventReuse",
      label: "Prevent reuse (last N passwords)",
      type: "number",
      min: 0,
      max: 10,
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading password policy...
      </div>
    );
  }
  if (!editing || !policy) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load password policy
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary-500" />
          <span className="font-medium">Password Policy</span>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Policy"}
        </button>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => (
          <div
            key={req.key}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div>
              <span className="text-sm font-medium">{req.label}</span>
              {req.type === "boolean" && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {editing[req.key as keyof PasswordPolicyType]
                    ? "Enabled"
                    : "Disabled"}
                </span>
              )}
            </div>
            {req.type === "boolean" ? (
              <button
                onClick={() =>
                  handleChange(
                    req.key as keyof PasswordPolicyType,
                    !editing[req.key as keyof PasswordPolicyType],
                  )
                }
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${editing[req.key as keyof PasswordPolicyType] ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
              >
                {editing[req.key as keyof PasswordPolicyType]
                  ? "Enabled"
                  : "Disabled"}
              </button>
            ) : (
              <input
                type="number"
                value={editing[req.key as keyof PasswordPolicyType] as number}
                onChange={(e) =>
                  handleChange(
                    req.key as keyof PasswordPolicyType,
                    Number(e.target.value),
                  )
                }
                min={req.min}
                max={req.max}
                className="w-24 px-3 py-1 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-700 dark:text-blue-400">
          Password Requirements
        </h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-300">
          <li> Minimum {policy.minLength} characters</li>
          {policy.requireUppercase && <li>At least 1 uppercase letter</li>}
          {policy.requireLowercase && <li>At least 1 lowercase letter</li>}
          {policy.requireNumber && <li>At least 1 number</li>}
          {policy.requireSpecialChar && <li>At least 1 special character</li>}
          {policy.maxAgeDays > 0 && (
            <li>Expires after {policy.maxAgeDays} days</li>
          )}
          {policy.preventReuse > 0 && (
            <li>Cannot reuse last {policy.preventReuse} passwords</li>
          )}
        </ul>
      </div>
    </div>
  );
};
