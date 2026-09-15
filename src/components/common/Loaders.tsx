import React from "react";
import { Skeleton } from "./Skeleton";

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-96">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// state card Skeleton

export const StateCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="rounded" width={40} height={40} />
      <Skeleton variant="text" width={60} height={16} />
    </div>
    <Skeleton variant="text" width="60%" height={28} className="mb-2" />
    <Skeleton variant="text" width="40%" height={14} />
  </div>
);

// Table Skeleton

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-border overflow-hidden">
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-border">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" width="100%" height={16} />
        ))}
      </div>
    </div>
    {/* body */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        className="p-4 border-b border-border/50 last:border-0"
      >
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="100%" height={16} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Chart Sketeton

export const ChartSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
    <Skeleton variant="text" width="40%" height={24} className="mb-6" />
    <div className="h-64 flex items-end justify-between gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          width="100%"
          height={`${Math.random() * 60 + 20}%`}
        />
      ))}
    </div>
  </div>
);

// card List Skeleton

export const CardListSkeleton: React.FC<{ count?: number }> = ({
  count = 4,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <StateCardSkeleton key={i} />
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* header */}
    <div>
      <Skeleton variant="text" width="30%" height={28} className="mb-2" />
      <Skeleton variant="text" width="50%" height={16} />
    </div>
    {/* states */}

    <CardListSkeleton count={4} />
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
    {/* Table */}
    <TableSkeleton rows={5} cols={5} />
  </div>
);

// button Loader

export const ButtonLoader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-3 w-3 border-2",
    md: "h-4 w-4 border-2",
    lg: "h-5 w-5 border-2",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-white border-t-transparent`}
    ></div>
  );
};
