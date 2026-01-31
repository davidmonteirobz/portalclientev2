import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "primary" | "muted";

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary/10 text-primary",
  muted: "bg-muted text-muted-foreground",
};

export function StatusBadge({ variant = "muted", children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
