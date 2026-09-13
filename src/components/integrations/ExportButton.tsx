// Export button for CSV/PDF downlode

import { useState } from "react";
import { Download, FileSpreadsheet, FileJson, Loader2 } from "lucide-react";
import { exportService } from "../../services/exportService";
import { useNotification } from "../../context/NotificationContext";

interface ExportButtonProps {
  data: any[];
  fileName: string;
  label?: string;
  format?: "csv" | "json" | "both";
  variant?: "primary" | "secondary" | "outline";
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  fileName,
  label = "Export",
  format = "csv",
  variant = "primary",
}) => {
  const { addNotification } = useNotification();
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const handleExport = (type: "csv" | "json") => {
    setIsExporting(true);
    try {
      if (type === "csv") {
        exportService.toCSV(data, fileName);
      } else if (type === "json") {
        exportService.toJSON(data, fileName);
      }

      console.log(`${type.toUpperCase()} exported successfully`);
      addNotification("exported successfully", "success");
    } catch (error) {
      console.error(" Export failed:", error);
      addNotification("export failed", "error");
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  const buttonStyles = {
    primary: `bg-primary-500 text-white hover:bg-primary-600`,
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
    outline: "border border-border hover:bg-muted",
  };
  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => {
          if (format === "both") {
            setShowOptions(!showOptions);
          } else {
            handleExport(format);
          }
        }}
        disabled={isExporting || data.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${buttonStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isExporting ? "Exporting..." : label}
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border py-1 z-50">
          <button
            onClick={() => handleExport("csv")}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            
            <FileSpreadsheet className="h-4 w-4" />
            Export as CSV
          </button>
          <button
            onClick={() => handleExport("json")}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FileJson className="h-4 w-4" />
            Export as JSON
          </button>
        </div>
      )}
      {/* Show count */}
      {data.length > 0 && (
        <span className="ml-2 text-xs text-muted-foreground">
          ({data.length} rows)
        </span>
      )}
    </div>
  );
};
