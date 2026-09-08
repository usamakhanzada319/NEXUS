import { useState } from "react";
import { Invoice } from "../../types";

import {
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Apple,
} from "lucide-react";

interface InvoiceCardProps {
  invoice: Invoice;
  onPay: (id: string, method: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onPay,
  onView,
  onDownload,
}) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const PaymentIcon = () => <span className="w-4 h-4">💰</span>;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "overdue":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const paymentMethods = [
    {
      id: "card",
      label: "Credit Card",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: "google_pay",
      label: "Google Pay",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: "apple_pay",
      label: "Apple Pay",
      icon: <Apple className="h-4 w-4" />,
    },
    { id: "paypal", label: "PayPal", icon: <PaymentIcon /> },
  ];

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-medium">{invoice.invoiceNumber}</p>
          <p className="text-sm text-muted-foreground">
            {invoice.invoiceNumber}.{formatDate(invoice.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold">{formatCurrency(invoice.totalAmount)}</p>
            <p className="text-sm text-muted-foreground">
              Due: {formatDate(invoice.dueDate)}
            </p>
          </div>
          <span
            className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${getStatusBadge(invoice.status)}`}
          >
            {getStatusIcon(invoice.status)}
            {invoice.status}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(invoice.id)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDownload(invoice.id)}
              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors dark:hover:bg-green-900/20"
            >
              <Download className="h-4 w-4" />
            </button>
            {invoice.status !== "paid" && (
              <div className="relative">
                <button
                  onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                  className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Pay Now
                </button>
                {showPaymentOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border py-1 z-50">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => {
                          onPay(invoice.id, method.id);
                          setShowPaymentOptions(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {method.icon}
                        {method.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Invoice Items */}
      {invoice.items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border text-sm">
          {invoice.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-muted-foreground"
            >
              <span>{item.description}</span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
