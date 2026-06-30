"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  HardDrive,
  MonitorCog,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Zap,
} from "lucide-react";
import { DashboardCard } from "../DashboardCard";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function jitter(value: number, amount: number, min: number, max: number) {
  return clamp(value + (Math.random() - 0.5) * amount, min, max);
}

function useUptime(startSeconds = 412_983) {
  const [seconds, setSeconds] = useState(startSeconds);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface Metrics {
  coreTemp: number;
  neuralLoad: number;
  latency: number;
  memory: number;
  gpu: number;
  confidence: number;
}

function useLiveMetrics(): Metrics {
  const [metrics, setMetrics] = useState<Metrics>({
    coreTemp: 47.2,
    neuralLoad: 68,
    latency: 112,
    memory: 54,
    gpu: 71,
    confidence: 97.4,
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics((prev) => ({
        coreTemp: jitter(prev.coreTemp, 1.2, 38, 62),
        neuralLoad: jitter(prev.neuralLoad, 6, 30, 96),
        latency: jitter(prev.latency, 14, 60, 240),
        memory: jitter(prev.memory, 3, 35, 88),
        gpu: jitter(prev.gpu, 5, 40, 95),
        confidence: jitter(prev.confidence, 0.6, 92, 99.8),
      }));
    }, 1800);

    return () => window.clearInterval(id);
  }, []);

  return metrics;
}

function MetricRow({
  icon: Icon,
  label,
  value,
  unit,
  percent,
  decimals = 0,
  warn = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  percent: number;
  decimals?: number;
  warn?: boolean;
}) {
  const barColor = warn ? "#FBBF24" : "#22D3EE";

  return (
    <div className="flex items-center gap-2.5 py-[5px]">
      <Icon size={11} strokeWidth={1.7} className="flex-shrink-0 text-cyan-400/55" aria-hidden="true" />

      <span className="w-[78px] flex-shrink-0 truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </span>

      <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor, boxShadow: `0 0 6px ${barColor}88` }}
          animate={{ width: `${clamp(percent, 2, 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <span
        className="w-[54px] flex-shrink-0 text-right text-[11px] font-bold tabular-nums tracking-tight"
        style={{ color: warn ? "#FBBF24" : "#E4E4E7" }}
      >
        {value.toFixed(decimals)}
        <span className="ml-0.5 text-[8px] font-medium text-zinc-600">{unit}</span>
      </span>
    </div>
  );
}

function CorePulse() {
  return (
    <div className="relative flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="absolute inset-0">
        <circle cx="44" cy="44" r="42" fill="none" stroke="rgba(34,211,238,0.10)" strokeWidth="1" />
        <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(34,211,238,0.14)" strokeWidth="1" strokeDasharray="2 4" />
      </svg>

      <motion.svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="44"
          cy="44"
          r="38"
          fill="none"
          stroke="url(#ai-sweep-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40 200"
        />
        <defs>
          <linearGradient id="ai-sweep-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </motion.svg>

      <motion.div
        className="absolute h-7 w-7 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(165,243,252,0.9) 0%, rgba(34,211,238,0.5) 55%, transparent 75%)",
          boxShadow: "0 0 18px 4px rgba(34,211,238,0.45)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]" />
    </div>
  );
}

function Waveform() {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeed((s) => s + 1), 900);
    return () => window.clearInterval(id);
  }, []);

  const points = Array.from({ length: 28 }, (_, i) => {
    const base = Math.sin((i + seed) * 0.5) * 4;
    const spike = i % 9 === 4 ? 14 * Math.sin((i + seed) * 9) : 0;
    const y = 16 + base + spike;
    return `${i * 4.6},${clamp(y, 2, 30)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 128 32" className="h-7 w-full" preserveAspectRatio="none" aria-hidden="true">
      <motion.polyline
        key={seed}
        points={points}
        fill="none"
        stroke="#22D3EE"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 3px rgba(34,211,238,0.6))" }}
      />
    </svg>
  );
}

function RightStat({
  icon: Icon,
  label,
  value,
  tone = "cyan",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "cyan" | "ok" | "warn";
}) {
  const color = tone === "ok" ? "#34D399" : tone === "warn" ? "#FBBF24" : "#67E8F9";

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-white/[0.05] bg-white/[0.015] px-2.5 py-[6px]">
      <div className="flex min-w-0 items-center gap-1.5">
        <Icon size={10} strokeWidth={1.8} style={{ color }} className="flex-shrink-0" aria-hidden="true" />
        <span className="truncate text-[9px] font-semibold uppercase tracking-[0.09em] text-zinc-500">{label}</span>
      </div>
      <span className="flex-shrink-0 text-[10px] font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

interface LogEntry {
  id: number;
  text: string;
  status: "ok" | "warn";
  time: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, text: "Threat scan completed", status: "ok", time: "00:00:42" },
  { id: 2, text: "Market analysis finished", status: "ok", time: "00:01:08" },
  { id: 3, text: "Voice assistant active", status: "ok", time: "00:01:55" },
  { id: 4, text: "Background learning running", status: "warn", time: "00:02:30" },
];

function LogRow({ entry }: { entry: LogEntry }) {
  const Icon = entry.status === "ok" ? CheckCircle2 : AlertTriangle;
  const color = entry.status === "ok" ? "#34D399" : "#FBBF24";

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 py-[3px]"
    >
      <Icon size={10} strokeWidth={2} style={{ color }} className="flex-shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate text-[10.5px] text-zinc-400">{entry.text}</span>
      <span className="flex-shrink-0 font-mono text-[9px] tabular-nums text-zinc-600">{entry.time}</span>
    </motion.div>
  );
}

export default function AIStatus() {
  const metrics = useLiveMetrics();
  const uptime = useUptime();
  const [scanPulse, setScanPulse] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setScanPulse((p) => !p), 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <DashboardCard title="AI Core Monitor" icon={Cpu}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-cyan-400/15 bg-gradient-to-r from-cyan-400/[0.06] to-transparent px-2.5 py-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">
              AI Core - Online
            </span>
          </div>
          <span className="font-mono text-[9px] tabular-nums text-zinc-600">{uptime}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col divide-y divide-white/[0.04] rounded-lg border border-white/[0.05] bg-white/[0.012] px-2.5">
            <MetricRow icon={Thermometer} label="Core Temp" value={metrics.coreTemp} unit="C" percent={(metrics.coreTemp / 80) * 100} decimals={1} warn={metrics.coreTemp > 56} />
            <MetricRow icon={Activity} label="Neural Load" value={metrics.neuralLoad} unit="%" percent={metrics.neuralLoad} />
            <MetricRow icon={Zap} label="Latency" value={metrics.latency} unit="ms" percent={(metrics.latency / 260) * 100} warn={metrics.latency > 180} />
            <MetricRow icon={HardDrive} label="Memory" value={metrics.memory} unit="%" percent={metrics.memory} />
            <MetricRow icon={MonitorCog} label="GPU Usage" value={metrics.gpu} unit="%" percent={metrics.gpu} warn={metrics.gpu > 85} />
            <MetricRow icon={Sparkles} label="Confidence" value={metrics.confidence} unit="%" percent={metrics.confidence} decimals={1} />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.012] p-2.5">
              <CorePulse />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                  Live Activity
                </span>
                <Waveform />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <RightStat icon={Cpu} label="Active Models" value="3" />
              <RightStat icon={MonitorCog} label="Processes" value="14" />
              <RightStat
                icon={scanPulse ? ShieldAlert : ShieldCheck}
                label="Threat Scan"
                value={scanPulse ? "Scanning" : "Secure"}
                tone={scanPulse ? "warn" : "ok"}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.05] bg-black/20 px-2.5 py-2">
          <div className="mb-1 flex items-center gap-1.5">
            <Radar size={10} strokeWidth={1.8} className="text-cyan-400/50" aria-hidden="true" />
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              Recent AI Logs
            </span>
          </div>
          <AnimatePresence initial={false}>
            <div className="flex flex-col">
              {INITIAL_LOGS.map((entry) => (
                <LogRow key={entry.id} entry={entry} />
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardCard>
  );
}
