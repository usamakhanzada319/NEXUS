import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { apiClient } from "../api/client";
import { Provider } from "../types";
import { useAuth } from "../context/AuthContext";

export const Providers: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

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

  const handleToggle = async (id: string) => {
    try {
      await apiClient.toggleProviderStatus(id);
      await fetchProviders();
    } catch (error) {
      console.log("Failed to toggle provider:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this provider?")) return;
      await apiClient.deleteProvider(id);
      await fetchProviders();
    } catch (error) {
      console.log("Failed to Delete provider:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading....</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}

      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Providers</div>
          <p className="text-muted-foreground">
            Manage AI providers and their availability
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Provider
          </button>
        )}
      </div>
      {/* Provider List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{provider.icon || "🤖"}</span>

                <div>
                  <h3 className="font-semibold">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {provider.models.length} models
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  provider.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {provider.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Pricing:${provider.pricing.input}/1M . $
                {provider.pricing.output}/1M
              </p>
              <p className="mt-1">Models: {provider.models.join(", ")}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleToggle(provider.id)}
                    className={`p-1.5 text-sm rounded-lg transition-colors ${
                      provider.isActive
                        ? "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                        : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                    }`}
                  >
                    {provider.isActive ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </button>
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setEditingProvider(provider);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(provider.id)}
                        className="p-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProvider ? "Edit Provider" : "Add New Provider"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = {
                  name: formData.get("name") as string,
                  slug: (formData.get("name") as string)
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                  isActive: true,
                  models: (formData.get("models") as string)
                    .split(",")
                    .map((m) => m.trim()),
                  pricing: {
                    input:
                      parseFloat(formData.get("inputPrice") as string) || 0,
                    output:
                      parseFloat(formData.get("outputPrice") as string) || 0,
                  },
                  icon: (formData.get("icon") as string) || "🤖",
                };
                try {
                  if (editingProvider) {
                    await apiClient.updateProvider(editingProvider.id, data);
                  } else {
                    await apiClient.addProvider(data);
                  }
                  await fetchProviders();
                  setShowForm(false);
                  setEditingProvider(null);
                } catch (error) {
                  console.error("Failed to save provider:", error);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProvider?.name || ""}
                  placeholder="e.g., OpenAI"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingProvider?.icon || "🤖"}
                  placeholder="e.g., 🤖"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Models (comma separated)
                </label>
                <input
                  name="models"
                  type="text"
                  defaultValue={editingProvider?.models.join(", ") || ""}
                  placeholder="e.g., gpt-4, gpt-3.5-turbo"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Input Price ($/1M)
                  </label>
                  <input
                    type="number"
                    name="inputPrice"
                    step="0.01"
                    defaultValue={editingProvider?.pricing.input || 0}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Output Price ($/1M)
                  </label>
                  <input
                    name="outputPrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingProvider?.pricing.output || 0}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingProvider ? "Update" : "Create"}
                </button>
                <button
                  onClick={() => {
                    setEditingProvider(null);
                    setShowForm(false);
                  }}
                  className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
