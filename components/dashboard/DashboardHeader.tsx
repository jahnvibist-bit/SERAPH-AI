"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

/**
 * Placeholder dashboard header. Sits above the card grid.
 * No business logic — purely presentational.
 */
export default function DashboardHeader({
  title = "Command Center",
  subtitle = "Mission control overview",
}: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center justify-between gap-3 px-1 pb-2"
    >
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-[0.01em] text-zinc-100">
          {title}
        </h1>
        <p className="mt-0.5 truncate text-[13px] text-zinc-500">{subtitle}</p>
      </div>

      <div
        className="flex flex-shrink-0 items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] px-3 py-1.5"
        role="status"
        aria-label="System status: live"
      >
        <Radio size={11} strokeWidth={2} className="text-cyan-300/80" aria-hidden="true" />
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-cyan-300/80">
          Live
        </span>
      </div>
    </motion.header>
  );
}