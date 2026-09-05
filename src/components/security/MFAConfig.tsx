import React, { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { useNotification } from "../../context/NotificationContext";
import { QrCode, Shield, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface MFAConfigProps {
  userId: string;
}

export const MFAConfig: React.FC<MFAConfigProps> = ({ userId }) => {
  const { addNotification } = useNotification();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    loadMFAConfig();
  }, []);

  const loadMFAConfig = async () => {
    setIsLoading(true);
    try {
      const config = await apiClient.getMFAConfig(userId);
      if (config) {
        setIsEnabled(config.isEnabled || false);
        if (config.isEnabled) {
          setBackupCodes(config.backupCodes || []);
        }
      }
    } catch (error) {
      console.error("Failed to load MFA config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.generateTOTPSecret(userId);
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setBackupCodes(response.backupCodes);
      addNotification(
        "MFA setup started. Scan the QR code with Google Authenticator.",
        "info",
      );
    } catch (error) {
      console.error("Failed to setup MFA:", error);
      addNotification("Failed to setup MFA", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      addNotification("Please enter a valid 6-digit code", "warning");
      return;
    }

    try {
      const success = await apiClient.verifyMFACode(userId, verificationCode);
      if (success) {
        setIsEnabled(true);
        addNotification("MFA enabled successfully!", "success");
        await loadMFAConfig();
      } else {
        addNotification(
          "Invalid verification code. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Failed to verify MFA:", error);
      addNotification("Failed to verify MFA", "error");
    }
  };
  const handleDisable = async () => {
    if (
      !confirm(
        "Are you sure you want to disable MFA? This will reduce your account security.",
      )
    ) {
      return;
    }

    try {
      await apiClient.disableMFA(userId);
      setIsEnabled(false);
      setQrCode("");
      setSecret("");
      setBackupCodes([]);
      addNotification("MFA disabled successfully.", "success");
      await loadMFAConfig();
    } catch (error) {
      console.error("Failed to disable MFA:", error);
      addNotification("Failed to disable MFA", "error");
    }
  };
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading MFA configuration...
      </div>
    );
  }
  if (isEnabled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div>
            <h3 className="font-semibold text-green-700 dark:text-green-400">
              MFA Enabled
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300">
              Two-factor authentication is active for your account.
            </p>
          </div>
        </div>

        {backupCodes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Backup Codes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={handleDisable}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Disable MFA
        </button>
      </div>
    );
  }
  if (qrCode && secret) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-lg border border-border">
            <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
              <QrCode className="h-24 w-24 text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Scan this QR code with Google Authenticator or similar app.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Secret key (if QR code doesn't work)
          </label>
          <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded break-all ">
            {secret}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Enter 6-digit verification code
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-48 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-center text-lg"
            />
            <button
              onClick={handleVerify}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Verify & Enable
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center py-8">
      <Shield className="h-16 w-16 max-auto text-muted-foreground " />
      <h3 className="text-lg font-semibold">Secure your account with MFA</h3>
      <p className="text-sm text-muted-foreground max-w-md max-auto">
        Add an extra layer of security to your account by enabling two-factor
        authentication.
      </p>

      <button
        onClick={handleSetup}
        disabled={isSettingUp}
        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        {
          <RefreshCw
            className={`h-4 w-4 inline mr-2 ${isSettingUp ? "animate-spin" : ""}`}
          />
        }
        {isSettingUp ? "Setting up..." : "Enable MFA"}
      </button>
    </div>
  );
};
