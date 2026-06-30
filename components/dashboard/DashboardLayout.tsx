"use client";
import DashboardHeader from "./DashboardHeader";
import MissionOverview from "./cards/MissionOverview";
import AIStatus from "./cards/AIStatus";
import QuickActions from "./cards/QuickAction";
import AnalyticsCard from "./cards/AnalyticsCard";
import ActiveMissions from "./cards/ActiveMission";
import RecentActivity from "./cards/RecentActivity";

/**
 * DashboardLayout
 *
 * Pure arrangement component. Renders the dashboard header and the
 * three-row card grid (MissionOverview/AIStatus, AnalyticsCard/ActiveMissions,
 * QuickActions/RecentActivity).
 *
 * This component does NOT know about the Navbar or Sidebar. It assumes its
 * parent container already accounts for their dimensions (via padding,
 * margin, or flex placement) and simply fills 100% of the space it is given.
 *
 * No fixed/absolute positioning, no hardcoded pixel offsets, no business logic.
 */
export default function DashboardLayout() {
  return (
    <div
      className="flex flex-1 min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden"
      role="main"
      aria-label="Dashboard"
    >
      {/* Inner padded content column — 8px spacing system (gap-6 = 24px, p-6 = 24px) */}
      <div className="flex flex-1 min-h-0 flex-col gap-6 p-6">
        <DashboardHeader />

        {/* Card grid — responsive, no horizontal scroll, equal-width columns */}
        <div className="grid flex-1 min-h-0 auto-rows-min grid-cols-1 gap-6 lg:grid-cols-2">
          <MissionOverview />
          <AIStatus />

          <AnalyticsCard />
          <ActiveMissions />

          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}