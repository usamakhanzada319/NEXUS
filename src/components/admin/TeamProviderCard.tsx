import React, { useState } from 'react';
import { Provider } from '../../types';
import { 
  Check, X, Edit2, Save, Trash2, Power, PowerOff, 
  Eye, EyeOff, Key 
} from 'lucide-react';
import { maskApiKey, isValidApiKey } from '../../utils/encryption';

interface TeamProviderCardProps {
  provider: Provider & {
    enabled: boolean;
    spendLimit: number;
    modelsAssigned: string[];
    apiKeyEncrypted?: string;
  };
  teamId: string;
  onToggle: (providerId: string) => void;
  onUpdate: (providerId: string, data: { 
    spendLimit: number; 
    modelsAssigned: string[];
    apiKeyEncrypted?: string;
  }) => void;
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
  const [apiKey, setApiKey] = useState(provider.apiKeyEncrypted || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    const modelsArray = models.split(',').map(m => m.trim()).filter(Boolean);
    const updateData: { 
      spendLimit: number; 
      modelsAssigned: string[];
      apiKeyEncrypted?: string;
    } = { 
      spendLimit, 
      modelsAssigned: modelsArray 
    };
    
    // ✅ Only include API key if it's valid and changed
    if (apiKey && isValidApiKey(apiKey)) {
      updateData.apiKeyEncrypted = apiKey;
    }
    
    onUpdate(provider.id, updateData);
    setIsEditing(false);
  };

  const hasApiKey = provider.apiKeyEncrypted && provider.apiKeyEncrypted.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4 card-hover">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{provider.icon || '🤖'}</span>
          <div>
            <h4 className="font-semibold">{provider.name}</h4>
            <p className="text-xs text-muted-foreground">
              {provider.models.length} models available
            </p>
            {/* API Key Status */}
            {hasApiKey && (
              <div className="flex items-center gap-1 mt-0.5">
                <Key className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">API Key set</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(provider.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              provider.enabled
                ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                : 'text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800'
            }`}
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
          // ✅ Edit Mode
          <div className="space-y-3">
            {/* Spend Limit */}
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
            
            {/* Models */}
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
            
            {/* ✅ API Key Field */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key (optional)"
                  className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {apiKey && isValidApiKey(apiKey) ? (
                  <span className="text-green-500">✓ Valid API key</span>
                ) : apiKey ? (
                  <span className="text-red-500">✗ API key must be at least 8 characters</span>
                ) : (
                  'Optional — leave blank to use default'
                )}
              </p>
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
          // ✅ View Mode
          <div className="space-y-2">
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
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onRemove(provider.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* ✅ API Key Display */}
            <div className="flex items-center gap-2 text-sm">
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">API Key:</span>
              {hasApiKey ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {showApiKey ? provider.apiKeyEncrypted : maskApiKey(provider.apiKeyEncrypted || '')}
                  </span>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ) : (
                <span className="text-muted-foreground italic">Using default key</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};