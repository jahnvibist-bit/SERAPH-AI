"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  /** Optional small status string shown top-right (e.g. "LIVE", "4 ACTIVE") */
  badge?: string;
  className?: string;
}

/**
 * Shared visual shell for every dashboard card placeholder.
 * Titanium / graphite glass surface, soft cyan accent on the icon only.
 * Replace individual card bodies later — this shell stays constant.
 */
export function DashboardCard({
  title,
  icon: Icon,
  children,
  badge,
  className = "",
}: DashboardCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-label={title}
      className={`relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_4px_20px_rgba(0,0,0,0.35)] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7 border border-cyan-400/15 bg-gradient-to-br from-white/[0.04] to-transparent"
            aria-hidden="true"
          >
            <Icon size={14} strokeWidth={1.6} className="text-cyan-300/70" />
          </span>
          <h2 className="truncate text-[13px] font-medium tracking-[0.01em] text-zinc-200">
            {title}
          </h2>
        </div>

        {badge && (
          <span className="flex-shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase text-cyan-300/80">
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 min-h-0">{children}</div>
    </motion.section>
  );
}