"use client";

import { BarChart2 } from "lucide-react";
import { DashboardCard } from "../DashboardCard";

/** Placeholder — replace with real analytics visualization. */
export default function AnalyticsCard() {
  return (
    <DashboardCard title="Analytics" icon={BarChart2}>
      <div className="flex h-full min-h-[140px] flex-col justify-center gap-1.5">
        <p className="text-[13px] leading-relaxed text-zinc-500">
          Analytics chart content will render here.
        </p>
        <p className="text-[11px] text-zinc-600">Placeholder component</p>
      </div>
    </DashboardCard>
  );
}