import React, { useState } from "react";
import { PaymentMethod } from "../../types";
import {
  CreditCard,
  Smartphone,
  Apple,
  Building2,
  Trash2,
  Star,
  X,
} from "lucide-react";

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  onAdd: (method: any) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  methods,
  onAdd,
  onRemove,
  onSetDefault,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const PaymentIcon = () => <span className="h-6 w-6 text-blue-400">💰</span>;
  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-6 w-6 text-muted-foreground" />;
      case "google_pay":
        return <Smartphone className="h-6 w-6 text-blue-500" />;
      case "apple_pay":
        return <Apple className="h-6 w-6 text-gray-600 dark:text-gray-300" />;
      case "paypal":
        return <PaymentIcon />;
      case "upi":
        return <Smartphone className="h-6 w-6 text-green-500" />;
      case "bank":
        return <Building2 className="h-6 w-6 text-muted-foreground" />;
      default:
        return <CreditCard className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getMethodLabel = (type: string) => {
    switch (type) {
      case "card":
        return "Credit/Debit Card";
      case "google_pay":
        return "Google Pay";
      case "apple_pay":
        return "Apple Pay";
      case "paypal":
        return "PayPal";
      case "upi":
        return "UPI";
      case "bank":
        return "Bank Transfer";
      default:
        return type;
    }
  };

  const getMethodBadge = (type: string) => {
    switch (type) {
      case "google_pay":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "apple_pay":
        return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      case "paypal":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "upi":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };
  const handleAddMethod = (methodType: string) => {
    const newMethod = {
      id: Date.now().toString(),
      type: methodType,
      last4: "1234",
      isDefault: methods.length === 0,
      createdAt: new Date().toISOString(),
    };
    onAdd(newMethod);
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-500" />
          Payment Methods
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          + Add Payment Method
        </button>
      </div>
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Payment Method</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Credit/Debit Card */}
              <button
                onClick={() => handleAddMethod("card")}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-muted-foreground">
                    Visa, Mastercard, Amex
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Popular</span>
              </button>

              {/* Google Pay */}
              <button
                onClick={() => handleAddMethod("google_pay")}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Smartphone className="h-5 w-5 text-blue-500" />
                <div className="flex-1 text-left">
                  <p className="font-medium">Google Pay</p>
                  <p className="text-sm text-muted-foreground">
                    Pay with your Google Wallet
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  Fast
                </span>
              </button>

              {/* Apple Pay */}
              <button
                onClick={() => handleAddMethod("apple_pay")}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Apple className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <div className="flex-1 text-left">
                  <p className="font-medium">Apple Pay</p>
                  <p className="text-sm text-muted-foreground">
                    Pay with your Apple Wallet
                  </p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  Secure
                </span>
              </button>

              {/*  PayPal */}
              <button
                onClick={() => handleAddMethod("paypal")}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="h-5 w-5 text-blue-400 text-lg">💰</span>
                <div className="flex-1 text-left">
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-muted-foreground">
                    Pay with your PayPal account
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Payment methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg transition-colors ${
              method.isDefault
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-border hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 ">
                {getMethodIcon(method.type)}
                <div>
                  <p className="font-medium">{getMethodLabel(method.type)}</p>
                  <p className="text-sm text-muted-foreground">
                    •••• {method.last4}
                  </p>
                </div>
              </div>
              {method.isDefault && (
                <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${getMethodBadge(method.type)}`}
              >
                {method.type.replace("_", " ").toUpperCase()}
              </span>
              {!method.isDefault && (
                <button
                  onClick={() => onSetDefault(method.id)}
                  className="text-xs text-primary-500 hover:text-primary-600"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => onRemove(method.id)}
                className="text-xs text-red-500 hover:text-red-600 ml-auto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Google Pay Badge */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Google Pay Available
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Pay quickly and securely with your saved Google Wallet cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
