"use client";

import { Layers } from "lucide-react";
import { DashboardCard } from "../DashboardCard";

/** Placeholder — replace with real active missions list. */
export default function ActiveMissions() {
  return (
    <DashboardCard title="Active Missions" icon={Layers} badge="4">
      <div className="flex h-full min-h-[140px] flex-col justify-center gap-1.5">
        <p className="text-[13px] leading-relaxed text-zinc-500">
          Active missions list will render here.
        </p>
        <p className="text-[11px] text-zinc-600">Placeholder component</p>
      </div>
    </DashboardCard>
  );
}