import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Provider } from "../types";

interface ProviderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Provider>) => void;
  initialData?: Provider | null;
  isEditing?: boolean;
}

export const ProviderForm: React.FC<ProviderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🤖");
  const [models, setModels] = useState("");
  const [inputPrice, setInputPrice] = useState("0");
  const [outputPrice, setOutputPrice] = useState("0");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIcon(initialData.icon || "🤖");
      setModels(initialData.models.join(", "));
      setInputPrice(String(initialData.pricing.input));
      setOutputPrice(String(initialData.pricing.output));
    } else {
      setName("");
      setIcon("🤖");
      setModels("");
      setInputPrice("0");
      setOutputPrice("0");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      icon,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      isActive: true,
      models: models.split(",").map((m) => m.trim()),
      pricing: {
        input: parseFloat(inputPrice) || 0,
        output: parseFloat(outputPrice) || 0,
      },
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Provider" : "Add New Provider"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Provider Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., 🤖"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Models (comma separated)
            </label>
            <input
              type="text"
              value={models}
              onChange={(e) => setModels(e.target.value)}
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
                step="0.01"
                value={inputPrice}
                onChange={(e) => setInputPrice(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Output Price ($/1M)
              </label>
              <input
                type="number"
                step="0.01"
                value={outputPrice}
                onChange={(e) => setOutputPrice(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {isEditing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
