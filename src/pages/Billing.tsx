import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { apiClient } from "../api/client";

import { Invoice, PaymentMethod, BillingSummary } from "../types";

import { InvoiceCard } from "../components/billing/InvoiceCard";
import { PaymentMethods } from "../components/billing/PaymentMethods";
import { UsageReport } from "../components/billing/UsageReport";

import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Smartphone,
  Clock,
} from "lucide-react";

export const Billing: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const { currentTeam } = useTeam();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"invoices" | "payment" | "usage">(
    "invoices",
  );
  useEffect(() => {
    fetchBillingData();
  }, [currentTeam]);

  const fetchBillingData = async () => {
    setIsLoading(true);
    try {
      const teamId = currentTeam?.id;
      const [invoicesData, methodsData, summaryData] = await Promise.all([
        apiClient.getInvoice(teamId),
        apiClient.getPaymentMethods(teamId || " "),
        apiClient.getBillingSummary(),
      ]);
      setInvoices(invoicesData);
      setPaymentMethods(methodsData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string, method: string) => {
    try {
      const updated = await apiClient.payInvoice(invoiceId, method);
      if (updated) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? updated : inv)),
        );
      }
    } catch (error) {
      console.error("Failed to pay invoice:", error);
    }
  };

  const handleAddPaymentMethod = async (method: any) => {
    try {
      const newMethod = await apiClient.addPaymentMethod(method);
      setPaymentMethods((prev) => [...prev, newMethod]);
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  };
  const handleRemovePaymentMethod = async (id: string) => {
    try {
      await apiClient.removePaymentMethod(id);
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    } catch (error) {
      console.error("Failed to remove payment method:", error);
    }
  };

  const handleSetDefaultPayment = async (id: string) => {
    try {
      await apiClient.setDefaultPaymentMethod(currentTeam?.id || "", id);
      setPaymentMethods((prev) =>
        prev.map((pm) => ({ ...pm, isDefault: pm.id === id })),
      );
    } catch (error) {
      console.error("Failed to set default payment:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (!isAdmin && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          Loading billing data...
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "payment", label: "Payment Method", icon: CreditCard },
    { id: "usage", label: "Usage Reports", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing & Invoicing</h1>
          <p className="text-muted-foreground">
            {currentTeam
              ? `Manage billing for ${currentTeam.name}`
              : "Manage billing for all teams"}
          </p>
        </div>
        <button
          onClick={fetchBillingData}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.totalRevenue)}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-500">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.totalInvoices}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {summary.pendingInvoices + summary.overdueInvoices}
                </p>
                <p className="text-sm text-muted-foreground">Pending/Overdue</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.averageInvoiceAmount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Avg Invoice Amount
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Pay Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Google Pay & Apple Pay Available
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Pay invoices quickly and securely with your saved wallets.
            </p>
          </div>
        </div>
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
      {/* Tab Content */}
      {activeTab === "invoices" && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-500" />
            Invoices
          </h2>
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No invoices found</p>
              </div>
            ) : (
              invoices.map((inv) => (
                <InvoiceCard
                  key={inv.id}
                  invoice={inv}
                  onPay={handlePayInvoice}
                  onView={(id: Invoice["id"]) =>
                    console.log("View invoice:", id)
                  }
                  onDownload={(id: Invoice["id"]) =>
                    console.log("Download invoice:", id)
                  }
                />
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <PaymentMethods
            methods={paymentMethods}
            onAdd={handleAddPaymentMethod}
            onRemove={handleRemovePaymentMethod}
            onSetDefault={handleSetDefaultPayment}
          />
        </div>
      )}
      {activeTab === "usage" && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
          <UsageReport teamId={currentTeam?.id || ""} />
        </div>
      )}
    </div>
  );
};
