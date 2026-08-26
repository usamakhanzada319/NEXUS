import React, { ReactNode, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { Notification, NotificationType } from "../../types";

interface ToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const iconMap: Record<NotificationType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const bgMap: Record<NotificationType, string> = {
  success:
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

export const Toast: React.FC<ToastProps> = ({ onRemove, notification }) => {
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onRemove]);

  return (
    <div
      className={`flex items-center p-4 gap-3 rounded-lg border shadow-lg ${bgMap[notification.type]} animate-fade-in`}
      style={{
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      {iconMap[notification.type]}
      <span className=" text-sm font-medium text-gray-900 dark:text-white flex-1">
        {notification.message}
      </span>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
