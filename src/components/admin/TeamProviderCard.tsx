import React, { useState } from 'react';
import { Provider } from '../../types';
import { Check, X, Edit2, Save, Trash2, Power, PowerOff } from 'lucide-react';

interface TeamProviderCardProps {
  provider: Provider & {
    enabled: boolean;
    spendLimit: number;
    modelsAssigned: string[];
  };
  teamId: string;
  onToggle: (providerId: string) => void;
  onUpdate: (providerId: string, data: { spendLimit: number; modelsAssigned: string[] }) => void;
  onRemove: (providerId: string) => void;
}

export const TeamProviderCard: React.FC<TeamProviderCardProps> = ({
  provider,
  teamId,
  onToggle,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [spendLimit, setSpendLimit] = useState(provider.spendLimit);
  const [models, setModels] = useState(provider.modelsAssigned.join(', '));

  const handleSave = () => {
    const modelsArray = models.split(',').map(m => m.trim()).filter(Boolean);
    onUpdate(provider.id, { spendLimit, modelsAssigned: modelsArray });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{provider.icon || '🤖'}</span>
          <div>
            <h4 className="font-semibold">{provider.name}</h4>
            <p className="text-xs text-muted-foreground">
              {provider.models.length} models available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Button */}
          <button
            onClick={() => onToggle(provider.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              provider.enabled
                ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                : 'text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800'
            }`}
            aria-label={provider.enabled ? 'Disable' : 'Enable'}
          >
            {provider.enabled ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
          </button>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            provider.enabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {provider.enabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Config Section */}
      <div className="mt-3 pt-3 border-t border-border">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Spend Limit ($)
              </label>
              <input
                type="number"
                value={spendLimit}
                onChange={(e) => setSpendLimit(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
                step="100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Models (comma separated)
              </label>
              <input
                type="text"
                value={models}
                onChange={(e) => setModels(e.target.value)}
                placeholder="gpt-4, gpt-3.5-turbo"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Spend Limit: <span className="font-medium text-foreground">${provider.spendLimit}</span>
              </p>
              <p className="text-muted-foreground">
                Models: <span className="font-medium text-foreground">
                  {provider.modelsAssigned.length > 0 
                    ? provider.modelsAssigned.join(', ') 
                    : 'All models'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                aria-label="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onRemove(provider.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};