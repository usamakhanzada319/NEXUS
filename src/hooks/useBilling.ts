import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useNotification } from "../context/NotificationContext";
import { Invoice, PaymentMethod, BillingSummary } from "../types"

interface UseBillingReturn {
    invoices: Invoice[],
    paymentMethods: PaymentMethod[]
    summary: BillingSummary | null
    isLoading: boolean
    refreshBilling: () => Promise<void>
    payInvoice: (invoiceId: string, methos: string) => Promise<void>
    addPaymentMethod: (method: any) => Promise<void>
    removePaymentMethod: (id: string) => Promise<void>
    setDefaultPayment: (id: string) => Promise<void>
}


export const useBilling = (teamId?: string): UseBillingReturn => {
    const { addNotification } = useNotification();
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
    const [summary, setSummary] = useState<BillingSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshBilling = useCallback(async () => {
        setIsLoading(true);
        try {
            const [invoicesData, methodsData, summaryData] = await Promise.all([
                apiClient.getInvoice(),
                apiClient.getPaymentMethods(teamId || ""),
                apiClient.getBillingSummary()
            ])
            setInvoices(invoicesData);
            setPaymentMethods(methodsData);
            setSummary(summaryData)

        } catch (error) {
            console.error('Failed to fetch billing data:', error);
            addNotification('Failed to fetch billing data', 'error');

        } finally {
            setIsLoading(false)
        }

    }, [teamId, addNotification])


    const payInvoice = useCallback(async (invoiceId: string, method: string) => {
        try {
            const updated = await apiClient.payInvoice(invoiceId, method);
            if (updated) {
                setInvoices((prev) => prev.map((inv) => inv.id === invoiceId ? updated : inv));
                addNotification(`Invoice ${invoiceId} paid successfully!`, 'success')
            }
        } catch (error) {
            console.error('Failed to pay invoice:', error);
            addNotification('Failed to pay invoice', 'error');

        }
    }, [addNotification])
    const addPaymentMethod = useCallback(async (method: any) => {
        try {
            const newMethod = await apiClient.addPaymentMethod(method);
            setPaymentMethods((prev) => [...prev, newMethod])
            addNotification('Payment method added successfully!', 'success');

        } catch (error) {
            console.error('Failed to add payment method:', error);
            addNotification('Failed to add payment method', 'error');
        }
    }, [addNotification])

    const removePaymentMethod = useCallback(async (id: string) => {
        try {
            await apiClient.removePaymentMethod(id);
            setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
            addNotification('Payment method removed', 'success');
        } catch (error) {
            console.error('Failed to remove payment method:', error);
            addNotification('Failed to remove payment method', 'error');
        }
    }, [addNotification])

    const setDefaultPayment = useCallback(async (id: string) => {
        try {

            await apiClient.setDefaultPaymentMethod(teamId || " ", id);
            setPaymentMethods(prev =>
                prev.map(pm => ({ ...pm, isDefault: pm.id === id }))
            )
            addNotification('Default payment method updated', 'success');

        } catch (error) {
            console.error('Failed to set default payment:', error);
            addNotification('Failed to set default payment', 'error');
        }
    }, [teamId, addNotification])

    useEffect(() => {
        refreshBilling();
    }, [refreshBilling])

    return {
        invoices,
        paymentMethods,
        summary,
        isLoading,
        refreshBilling,
        payInvoice,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPayment,
    }
}