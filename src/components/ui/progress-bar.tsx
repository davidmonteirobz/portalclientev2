import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-foreground">Progresso</span>
          <span className="text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-secondary", sizeStyles[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            animated ? "progress-bar-animated" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
