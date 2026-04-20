import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function InfoCard({ title, icon: Icon, children, className }: InfoCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-6 shadow-xl", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function InfoItem({ label, value, subValue, highlight }: { label: string; value: string | number; subValue?: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="text-right">
        <p className={cn("font-medium", highlight ? "text-primary" : "text-foreground")}>{value}</p>
        {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      </div>
    </div>
  );
}
