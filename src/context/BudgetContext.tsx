import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TeamBudget, BudgetAlert } from "../types";
import { apiClient } from "../api/client";

interface BudgetContextType {
  budgets: TeamBudget[];
  alerts: BudgetAlert[];
  isLoading: boolean;
  refreshBudgets: () => Promise<void>;
  updateBudget: (teamId: string, updates: Partial<TeamBudget>) => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  totalBudget: number;
  totalSpend: number;
  overallPercent: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [budgets, setBudgets] = useState<TeamBudget[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBudgets = async () => {
    setIsLoading(true);
    try {
      const [budgetsData, alertsData] = await Promise.all([
        apiClient.getBudgets(),
        apiClient.getUnresolvedBudgetAlerts(),
      ]);
      setBudgets(budgetsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBudget = async (teamId: string, updates: Partial<TeamBudget>) => {
    try {
      const updated = await apiClient.updateBudget(teamId, updates);
      if (updated) {
        setBudgets((prev) =>
          prev.map((b) => (b.teamId === teamId ? updated : b)),
        );
        const alertsData = await apiClient.getUnresolvedBudgetAlerts();
        setAlerts(alertsData);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
      throw error;
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      await apiClient.resolveBudgetAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      throw error;
    }
  };
  useEffect(() => {
    refreshBudgets();
  }, []);

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpend = budgets.reduce((sum, b) => sum + b.currentMonthSpend, 0);
  const overallPercent = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        alerts,
        isLoading,
        refreshBudgets,
        updateBudget,
        resolveAlert,
        totalBudget,
        totalSpend,
        overallPercent,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
