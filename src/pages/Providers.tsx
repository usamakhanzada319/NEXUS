import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Power, PowerOff, Box } from "lucide-react";
import { apiClient } from "../api/client";
import { Provider } from "../types";
import { useAuth } from "../context/AuthContext";

export const Providers: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getProviders();
      setProviders(data);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    } finally {
      setIsLoading(false);
    }
  };
};
