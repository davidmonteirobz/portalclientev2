import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  variant?: "default" | "highlight" | "muted";
  className?: string;
}

const variantStyles = {
  default: "bg-card border-border",
  highlight: "bg-primary/5 border-primary/20",
  muted: "bg-muted/50 border-muted",
};

export function InfoCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  className,
}: InfoCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all card-hover",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
