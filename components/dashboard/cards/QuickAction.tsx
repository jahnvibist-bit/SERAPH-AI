"use client";

import { Zap } from "lucide-react";
import { DashboardCard } from "../DashboardCard";

/** Placeholder — replace with real quick action buttons. */
export default function QuickActions() {
  return (
    <DashboardCard title="Quick Actions" icon={Zap}>
      <div className="flex h-full min-h-[140px] flex-col justify-center gap-1.5">
        <p className="text-[13px] leading-relaxed text-zinc-500">
          Quick action shortcuts will render here.
        </p>
        <p className="text-[11px] text-zinc-600">Placeholder component</p>
      </div>
    </DashboardCard>
  );
}