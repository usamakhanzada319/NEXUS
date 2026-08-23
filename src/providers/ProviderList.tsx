import { Provider } from "../types";
import { Edit, Trash2, Power, PowerOff, Box } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React from "react";

interface ProviderListProps {
  providers: Provider[];
  onEdit: (provider: Provider) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isLoading?: boolean;
}

export const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  onDelete,
  onEdit,
  onToggle,
  isLoading = false,
}) => {
  const { isAdmin, isSuperAdmin } = useAuth();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 animate-pulse"
          >
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <Box className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No providers yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first AI provider to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.icon || "🤖"}</span>
                <div>
                  <h3 className="font-semibold">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {provider.models.length} models
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full${provider.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
              >
                {provider.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Pricing: ${provider.pricing.input}/1M input· $
                {provider.pricing.output}/1M output
              </p>
              <p className="mt-1">Models: {provider.models.join(", ")}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              {isAdmin && (
                <>
                  <button
                    onClick={() => onToggle(provider.id)}
                    className={`p-1.5 text-sm rounded-lg transition-colors ${
                      provider.isActive
                        ? `text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20`
                        : `text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20`
                    }`}
                  >
                    {provider.isActive ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </button>

                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(provider)}
                        className="p-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDelete(provider.id)}
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
    </>
  );
};
