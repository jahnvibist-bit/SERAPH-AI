"use client";

import { History } from "lucide-react";
import { DashboardCard } from "../DashboardCard";
/** Placeholder — replace with real activity feed content. */
export default function RecentActivity() {
  return (
    <DashboardCard title="Recent Activity" icon={History}>
      <div className="flex h-full min-h-[140px] flex-col justify-center gap-1.5">
        <p className="text-[13px] leading-relaxed text-zinc-500">
          Recent activity feed will render here.
        </p>
        <p className="text-[11px] text-zinc-600">Placeholder component</p>
      </div>
    </DashboardCard>
  );
}