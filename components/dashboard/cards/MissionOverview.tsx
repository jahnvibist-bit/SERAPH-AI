"use client";

import { motion } from "framer-motion";
import {
  Crosshair,
  Gauge,
  Timer,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Users,
} from "lucide-react";

interface KpiMetric {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: typeof Gauge;
}

interface Operator {
  initials: string;
}

export interface MissionOverviewProps {
  missionName?: string;
  missionCode?: string;
  isLive?: boolean;
  riskLevel?: "Low" | "Medium" | "High";
  progressPercent?: number;
  lastUpdated?: string;
  kpis?: KpiMetric[];
  operators?: Operator[];
  onOpenMission?: () => void;
}

const DEFAULT_KPIS: KpiMetric[] = [
  { label: "Velocity", value: "8.4/d", delta: "+12%", trend: "up", icon: TrendingUp },
  { label: "Risk Index", value: "2.1", delta: "-0.4", trend: "down", icon: Gauge },
  { label: "Tasks Remaining", value: "12", delta: "-5", trend: "down", icon: Target },
  { label: "Time Remaining", value: "3d 6h", delta: "+0%", trend: "up", icon: Timer },
];

const DEFAULT_OPERATORS: Operator[] = [
  { initials: "AM" },
  { initials: "RK" },
  { initials: "JL" },
  { initials: "TS" },
];

const RISK_STYLES: Record<
  NonNullable<MissionOverviewProps["riskLevel"]>,
  { text: string; ring: string; bg: string }
> = {
  Low: { text: "text-emerald-300", ring: "ring-emerald-400/25", bg: "bg-emerald-400/[0.08]" },
  Medium: { text: "text-amber-300", ring: "ring-amber-400/25", bg: "bg-amber-400/[0.08]" },
  High: { text: "text-rose-300", ring: "ring-rose-400/25", bg: "bg-rose-400/[0.08]" },
};

function ProgressRing({ percent }: { percent: number }) {
  const size = 76;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex flex-shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A5F3FC" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.55))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[18px] font-bold tabular-nums leading-none text-white">{percent}%</span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-500">done</span>
      </div>
    </div>
  );
}

function KpiWidget({ metric, delay }: { metric: KpiMetric; delay: number }) {
  const Icon = metric.icon;
  const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = metric.trend === "up" ? "text-emerald-400" : "text-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(34,211,238,0.08)]"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-400/0 blur-2xl transition-colors duration-500 group-hover:bg-cyan-400/10" />

      <div className="relative flex items-start justify-between gap-2">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/15 via-white/[0.03] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon size={14} strokeWidth={1.8} className="text-cyan-300" />
        </span>

        <span className={`flex items-center gap-0.5 rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${trendColor}`}>
          <TrendIcon size={10} strokeWidth={2.4} aria-hidden="true" />
          {metric.delta}
        </span>
      </div>

      <p className="relative mt-3 truncate text-[10px] font-medium uppercase tracking-[0.13em] text-zinc-500">
        {metric.label}
      </p>
      <p className="relative mt-1 text-[19px] font-bold tracking-tight text-white">{metric.value}</p>

      <div className="relative mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: metric.trend === "up" ? "72%" : "38%" }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500/60 to-cyan-300"
        />
      </div>
    </motion.div>
  );
}

function OperatorStack({ operators }: { operators: Operator[] }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-2.5" role="group" aria-label="Assigned operators">
        {operators.map((op, i) => (
          <motion.div
            key={op.initials}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-zinc-700 to-zinc-900 text-[9px] font-bold text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            title={op.initials}
          >
            {op.initials}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-zinc-600">
        <Users size={11} strokeWidth={1.8} aria-hidden="true" />
        <span className="text-[11px]">{operators.length} assigned</span>
      </div>
    </div>
  );
}

export default function MissionOverview({
  missionName = "Operation Nightfall",
  missionCode = "SRPH-MX-014",
  isLive = true,
  riskLevel = "Low",
  progressPercent = 68,
  lastUpdated = "2 minutes ago",
  kpis = DEFAULT_KPIS,
  operators = DEFAULT_OPERATORS,
  onOpenMission,
}: MissionOverviewProps) {
  const risk = RISK_STYLES[riskLevel];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Mission Overview"
      className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/60 via-zinc-950/80 to-black shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/[0.10] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-3xl" aria-hidden="true" />

      <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.06] px-6 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 via-white/[0.04] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_16px_rgba(34,211,238,0.12)]">
            <Crosshair size={16} strokeWidth={1.8} className="text-cyan-300" />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold tracking-[0.01em] text-zinc-100">Mission Overview</h2>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">{missionCode}</p>
          </div>
        </div>

        {isLive && (
          <span
            className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-400/15 to-cyan-300/5 px-3 py-1.5 shadow-[0_0_16px_rgba(34,211,238,0.18)]"
            role="status"
            aria-label="Mission status: live"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">Live</span>
          </span>
        )}
      </div>

      <div className="relative flex flex-col gap-5 px-6 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles size={13} strokeWidth={2} className="flex-shrink-0 text-cyan-400/70" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400/70">
                Primary Directive
              </span>
            </div>
            <h1 className="mt-1.5 truncate text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[30px]">
              {missionName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ${risk.bg} ${risk.ring}`}>
                <ShieldAlert size={11} strokeWidth={2} className={risk.text} aria-hidden="true" />
                <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${risk.text}`}>
                  {riskLevel} Risk
                </span>
              </span>

              <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-zinc-500">
                <Clock size={11} strokeWidth={1.8} aria-hidden="true" />
                <span className="text-[10px]">
                  Updated <span className="text-zinc-400">{lastUpdated}</span>
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <ProgressRing percent={Math.min(100, Math.max(0, progressPercent))} />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Execution Progress
            </span>
            <span className="text-[11px] font-semibold tabular-nums text-cyan-300/90">{progressPercent}/100</span>
          </div>
          <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-200"
              style={{ boxShadow: "0 0 14px rgba(34,211,238,0.5)" }}
            >
              <motion.div
                className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-3 px-6 pt-5 sm:grid-cols-4">
        {kpis.map((metric, i) => (
          <KpiWidget key={metric.label} metric={metric} delay={0.15 + i * 0.07} />
        ))}
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] bg-white/[0.015] px-6 py-4">
        <OperatorStack operators={operators} />

        <motion.button
          type="button"
          onClick={onOpenMission}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-[13px] font-bold text-zinc-950 shadow-[0_4px_20px_rgba(34,211,238,0.35)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(34,211,238,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
          <span className="relative">Open Mission</span>
          <ArrowUpRight
            size={15}
            strokeWidth={2.4}
            className="relative transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </motion.button>
      </div>
    </motion.section>
  );
}
