import {  useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSecurity } from "../hooks/useSecurity";
import { MFAConfig } from "../components/security/MFAConfig";
import { BackupCodes } from "../components/security/BackupCodes";
import { PasswordPolicy } from "../components/security/PasswordPolicy";
import { LoginHistory } from "../components/security/LoginHistory";
import { Shield, Key, History, Lock,  } from "lucide-react";

export const SecuritySetting: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { mfaConfig, isLoading, refreshSecurity } = useSecurity();

  const [activeTab, setActiveTab] = useState<
    "mfa" | "backup" | "password" | "history"
  >("mfa");

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-between h-64">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent">
            Loading security settings...
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "mfa", label: "MFA Setup", icon: Shield },
    { id: "backup", label: "Backup Codes", icon: Key },
    { id: "password", label: "Password Policy", icon: Lock },
    { id: "history", label: "Login History", icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage security settings and authentication
        </p>
      </div>
      {/* Tabs */}

      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
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
      {/* Content */}

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
        {activeTab === "mfa" && <MFAConfig userId={user?.id || ""} />}
        {activeTab === "backup" && <BackupCodes userId={user?.id || ""} />}
        {activeTab === "password" && <PasswordPolicy />}
        {activeTab === "history" && <LoginHistory userId={user?.id || ""} />}
      </div>
    </div>
  );
};
