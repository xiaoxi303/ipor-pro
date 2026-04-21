import { motion } from "framer-motion";
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("glass-card rounded-[2rem] p-8 relative overflow-hidden group", className)}
    >
      {/* Background Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all duration-500">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-black text-xl tracking-tight text-gradient">{title}</h3>
          <div className="h-0.5 w-8 bg-primary/30 rounded-full mt-1 group-hover:w-12 transition-all duration-500" />
        </div>
      </div>
      <div className="space-y-5 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function InfoItem({ label, value, subValue, highlight }: { label: string; value: string | number; subValue?: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0 gap-6 group/item">
      <span className="text-muted-foreground/60 text-xs font-black uppercase tracking-widest pt-1 group-hover/item:text-muted-foreground transition-colors shrink-0">
        {label}
      </span>
      <div className="text-right min-w-0 flex-1">
        <p className={cn(
          "font-bold text-base break-words transition-colors", 
          highlight ? "text-primary" : "text-foreground group-hover/item:text-primary/90"
        )}>
          {value || "N/A"}
        </p>
        {subValue && (
          <p className="text-[10px] font-mono text-muted-foreground/40 break-words mt-1 uppercase tracking-tighter">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
