interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular" | "rounded";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  variant = "text",
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className} `}
      style={style}
    />
  );
};
