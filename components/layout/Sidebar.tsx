"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  Crosshair,
  Layers,
  BarChart2,
  Settings,
  ShieldCheck,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAVBAR_HEIGHT = 52;
const WIDTH_OPEN    = 288;
const WIDTH_CLOSED  = 72;

// Chrome gradient — shared across Logo / Navbar / Sidebar
const CHROME =
  "linear-gradient(105deg, #5C5C5C 0%, #B8B8B8 28%, #F0F0F0 42%, #D4D4D4 50%, #8A8A8A 62%, #C0C0C0 80%, #6A6A6A 100%)";

// Icon container surfaces
const ICON_REST_BG =
  "linear-gradient(145deg, rgba(28,28,28,0.9) 0%, rgba(18,18,18,0.95) 100%)";
const ICON_HOVER_BG =
  "linear-gradient(145deg, rgba(38,38,38,0.95) 0%, rgba(26,26,26,1) 100%)";
const ICON_ACTIVE_BG =
  "linear-gradient(145deg, rgba(32,32,32,1) 0%, rgba(20,20,20,1) 100%)";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItemId = "dashboard" | "missions" | "strategy" | "analytics" | "settings";

interface NavItem {
  id:    NavItemId;
  label: string;
  icon:  React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

interface OperatorProfile {
  name:           string;
  callsign:       string;
  clearanceLevel: string;
  initials:       string;
  status:         "active" | "standby" | "offline";
}

export interface SidebarProps {
  activeItem?:  NavItemId;
  onNavigate?:  (id: NavItemId) => void;
  operator?:    OperatorProfile;
  collapsed?:   boolean;
  onCollapse?:  (collapsed: boolean) => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard",       icon: LayoutDashboard },
  { id: "missions",  label: "Mission Planner", icon: Crosshair       },
  { id: "strategy",  label: "Strategy",        icon: Layers          },
  { id: "analytics", label: "Analytics",       icon: BarChart2       },
  { id: "settings",  label: "Settings",        icon: Settings        },
];

const STATUS_DOT: Record<OperatorProfile["status"], string> = {
  active:  "#7DD4D8",
  standby: "#8A8A6A",
  offline: "#6A4A4A",
};

const DEFAULT_OPERATOR: OperatorProfile = {
  name:           "Alex Mercer",
  callsign:       "ALPHA-1",
  clearanceLevel: "CLEARANCE LVL 5",
  initials:       "AM",
  status:         "active",
};

// ─── PanelBorder ─────────────────────────────────────────────────────────────
// Titanium hairline — slightly brighter peak than before for more depth

function PanelBorder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 right-0 pointer-events-none"
      style={{
        width: "1px",
        background:
          "linear-gradient(180deg, transparent 0%, #1C1C1C 6%, #303030 28%, #262626 55%, #1C1C1C 88%, transparent 100%)",
        boxShadow: "-1px 0 12px rgba(0,0,0,0.6)",
      }}
    />
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

// ─── NavRow ───────────────────────────────────────────────────────────────────

function NavRow({
  item,
  isActive,
  isCollapsed,
  onClick,
  motionDelay,
}: {
  item:        NavItem;
  isActive:    boolean;
  isCollapsed: boolean;
  onClick:     () => void;
  motionDelay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  // Label colour — zinc scale for legibility
  const labelColor = isActive ? "#FFFFFF" : hovered ? "#A1A1AA" : "#52525B";

  // Icon container surface
  const iconBg = isActive
    ? ICON_ACTIVE_BG
    : hovered
    ? ICON_HOVER_BG
    : ICON_REST_BG;

  // Icon container border
  const iconBorder = isActive
    ? "0.5px solid rgba(125,212,216,0.25)"
    : hovered
    ? "0.5px solid rgba(255,255,255,0.10)"
    : "0.5px solid rgba(255,255,255,0.04)";

  // Icon container shadow — cyan inner glow on active
  const iconShadow = isActive
    ? "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(125,212,216,0.08), 0 2px 8px rgba(125,212,216,0.08)"
    : "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.35)";

  // Icon colour
  const iconColor = isActive ? "#C8C8C8" : hovered ? "#8A8A8A" : "#404040";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: motionDelay }}
      className="relative"
    >
      {/* Active glass pill — full width background */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-y-1 rounded-xl pointer-events-none"
          style={{
            left: "8px",
            right: "8px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          aria-hidden="true"
        />
      )}

      {/* Active left bar — 2px cyan indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style={{
            width: "2px",
            height: "18px",
            background: "linear-gradient(180deg, #9EE8EB 0%, #7DD4D8 50%, #5BBEC2 100%)",
            opacity: 0.7,
            boxShadow: "2px 0 8px rgba(125,212,216,0.3)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          aria-hidden="true"
        />
      )}

      <motion.button
        onClick={onClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        aria-current={isActive ? "page" : undefined}
        aria-label={isCollapsed ? item.label : undefined}
        title={isCollapsed ? item.label : undefined}
        // Hover: slide right 2px — the translate-x polish effect
        animate={{ x: hovered && !isActive ? 2 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full flex items-center focus-visible:outline-none cursor-pointer"
        style={{
          height: "44px",
          paddingLeft:    isCollapsed ? "0" : "16px",
          paddingRight:   isCollapsed ? "0" : "14px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "12px",
          background: "transparent",
          border: "none",
        }}
      >
        {/* Icon container — 32×32 metallic recess */}
        <span
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: "32px",
            height: "32px",
            background: iconBg,
            border: iconBorder,
            boxShadow: iconShadow,
            color: iconColor,
            transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease",
          }}
          aria-hidden="true"
        >
          <Icon size={18} strokeWidth={isActive ? 1.7 : 1.4} />
        </span>

        {/* Label */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="select-none whitespace-nowrap"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: labelColor,
                transition: "color 0.25s ease",
              }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

// ─── OperatorCard ─────────────────────────────────────────────────────────────

function OperatorCard({ operator, visible }: { operator: OperatorProfile; visible: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="mx-3 mb-3 overflow-hidden rounded-lg"
          style={{
            background:
              "linear-gradient(160deg, rgba(16,16,16,0.95) 0%, rgba(10,10,10,0.98) 100%)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)",
          }}
          role="region"
          aria-label="Operator status"
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-3 pt-3 pb-2"
            style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
          >
            <ShieldCheck
              size={10}
              strokeWidth={1.8}
              style={{ color: "#7DD4D8", opacity: 0.55, flexShrink: 0 }}
              aria-hidden="true"
            />
            <span
              className="select-none whitespace-nowrap"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "8px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#7DD4D8",
                opacity: 0.55,
              }}
            >
              {operator.clearanceLevel}
            </span>
          </div>

          {/* Body */}
          <div className="flex items-center gap-3 px-3 py-3">
            {/* Avatar */}
            <div
              className="flex-shrink-0 flex items-center justify-center relative rounded-full"
              style={{
                width: "34px",
                height: "34px",
                background: "linear-gradient(145deg, #141414 0%, #0C0C0C 100%)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.6)",
              }}
            >
              <span
                className="select-none"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  background: CHROME,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {operator.initials}
              </span>
              <span
                aria-hidden="true"
                className="absolute rounded-full"
                style={{
                  bottom: "0px",
                  right: "0px",
                  width: "8px",
                  height: "8px",
                  background: STATUS_DOT[operator.status],
                  border: "1.5px solid #0C0C0C",
                  opacity: 0.85,
                }}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className="block whitespace-nowrap overflow-hidden text-ellipsis select-none"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                  color: "#D4D4D8",
                }}
              >
                {operator.name}
              </span>
              <span
                className="block select-none"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "9px",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#3F3F46",
                }}
              >
                {operator.callsign}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SidebarFooter ────────────────────────────────────────────────────────────

function SidebarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{
        borderTop: "0.5px solid rgba(255,255,255,0.04)",
        minHeight: "48px",
        padding: isCollapsed ? "0" : "0 16px",
        justifyContent: isCollapsed ? "center" : "space-between",
        gap: "8px",
      }}
    >
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-0.5"
          >
            <span
              className="block select-none whitespace-nowrap"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: CHROME,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SERAPH OS
            </span>
            <span
              className="block select-none"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "9px",
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: "#27272A",
              }}
            >
              v0.1.0-alpha
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-visible status pip */}
      <span
        aria-hidden="true"
        className="flex-shrink-0 rounded-full"
        style={{
          width: "5px",
          height: "5px",
          background: "#7DD4D8",
          opacity: 0.45,
        }}
      />
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar({
  activeItem = "dashboard",
  onNavigate,
  operator   = DEFAULT_OPERATOR,
  collapsed: controlledCollapsed,
  onCollapse,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const setCollapsed = (val: boolean) => {
    if (onCollapse) onCollapse(val);
    else setInternalCollapsed(val);
  };

  return (
    <motion.aside
      aria-label="Main navigation"
      data-collapsed={isCollapsed}
      className="peer fixed flex flex-col overflow-hidden"
      style={{
        top: NAVBAR_HEIGHT,
        left: 0,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        zIndex: 40,
        // Layered background: deep black base + very subtle top-left radial warmth
        background: `
          radial-gradient(ellipse 60% 40% at 0% 0%, rgba(255,255,255,0.012) 0%, transparent 70%),
          linear-gradient(180deg, #0D0D0D 0%, #080808 40%, #060606 100%)
        `,
        backdropFilter: "blur(24px) saturate(1.15)",
        WebkitBackdropFilter: "blur(24px) saturate(1.15)",
      }}
      animate={{ width: isCollapsed ? WIDTH_CLOSED : WIDTH_OPEN }}
      initial={{ width: WIDTH_OPEN }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 300, damping: 36, mass: 0.9 }
      }
    >
      <PanelBorder />

      {/* ── Header: toggle left + logo right (expanded) / toggle centred (collapsed) ── */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          height: "52px",
          boxShadow: "0 0.5px 0 rgba(255,255,255,0.06)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.0) 100%)",
          paddingLeft: isCollapsed ? "0" : "12px",
          paddingRight: isCollapsed ? "0" : "12px",
          justifyContent: isCollapsed ? "center" : "space-between",
          gap: "8px",
        }}
      >
        {/* Toggle button — always visible, left when expanded / centred when collapsed */}
        <motion.button
          onClick={() => setCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="flex items-center justify-center focus-visible:outline-none cursor-pointer rounded-lg flex-shrink-0"
          style={{
            width: "32px",
            height: "32px",
            background: "transparent",
            border: "0.5px solid transparent",
            color: "#404040",
            fontSize: "16px",
            lineHeight: 1,
            transition: "color 0.2s ease, background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = "#909090";
            el.style.background = "rgba(255,255,255,0.05)";
            el.style.borderColor = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = "#404040";
            el.style.background = "transparent";
            el.style.borderColor = "transparent";
          }}
        >
          {/* Sidebar panel icon — same visual language as ChatGPT / Cursor */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.3"/>
            <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.3"/>
            {isCollapsed ? (
              /* Arrow pointing right — open */
              <polyline points="9,6.5 12,9 9,11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              /* Arrow pointing left — close */
              <polyline points="12,6.5 9,9 12,11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </motion.button>

        {/* Logo — only visible when expanded */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, x: 6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.88, x: 6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden"
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(145deg, rgba(24,24,24,0.9) 0%, rgba(14,14,14,0.95) 100%)",
                border: "0.5px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="SERAPH mark"
                style={{
                  display: "block",
                  filter: "drop-shadow(0 0 6px rgba(125,212,216,0.28))",
                }}
              >
                <path
                  d="M12 1.8 20.9 6.9v10.2L12 22.2 3.1 17.1V6.9L12 1.8Z"
                  stroke="url(#seraph-mark-metal)"
                  strokeWidth="1.1"
                  fill="#090909"
                />
                <path
                  d="M12 5.4 17.75 8.7v6.6L12 18.6 6.25 15.3V8.7L12 5.4Z"
                  stroke="#7DD4D8"
                  strokeOpacity="0.58"
                  strokeWidth="0.9"
                  fill="#0E0E0E"
                />
                <path
                  d="M12 8.15 15.15 14.1H8.85L12 8.15Z"
                  fill="url(#seraph-mark-metal)"
                  fillOpacity="0.95"
                />
                <path d="M12 10.55 13.75 13.65H10.25L12 10.55Z" fill="#090909" />
                <circle cx="12" cy="15.25" r="1.05" fill="#7DD4D8" />
                <defs>
                  <linearGradient
                    id="seraph-mark-metal"
                    x1="4"
                    y1="2"
                    x2="20"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F4F4F5" />
                    <stop offset="0.28" stopColor="#71717A" />
                    <stop offset="0.52" stopColor="#E4E4E7" />
                    <stop offset="0.78" stopColor="#52525B" />
                    <stop offset="1" stopColor="#D4D4D8" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Middle: nav list + operator card ──────────────────────────── */}
      <div
        className="flex flex-col overflow-hidden"
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingTop: "10px",
        }}
      >
        {/* Nav */}
        <nav aria-label="Primary navigation">
          <div style={{ marginTop: "6px" }}>
            {NAV_ITEMS.map((item, i) => (
              <NavRow
                key={item.id}
                item={item}
                isActive={item.id === activeItem}
                isCollapsed={isCollapsed}
                onClick={() => onNavigate?.(item.id)}
                motionDelay={0.06 + i * 0.05}
              />
            ))}
          </div>
        </nav>

        {/* Bottom section — operator card or collapsed avatar */}
        <div>
          {/* Divider — expanded only */}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
                style={{
                  height: "0.5px",
                  margin: "0 12px 8px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 70%, transparent 100%)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Collapsed: centred metallic avatar */}
          {isCollapsed && (
            <div
              className="flex items-center justify-center"
              style={{ padding: "16px 0 8px" }}
            >
              <div
                className="flex items-center justify-center relative rounded-full"
                style={{
                  width: "34px",
                  height: "34px",
                  background: "linear-gradient(145deg, #141414 0%, #0C0C0C 100%)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.6)",
                }}
                aria-label={`${operator.name} — ${operator.status}`}
                title={`${operator.name} — ${operator.status}`}
              >
                <span
                  className="select-none"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: "10px",
                    fontWeight: 500,
                    background: CHROME,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {operator.initials}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute rounded-full"
                  style={{
                    bottom: "0px",
                    right: "0px",
                    width: "8px",
                    height: "8px",
                    background: STATUS_DOT[operator.status],
                    border: "1.5px solid #0C0C0C",
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          )}

          <OperatorCard operator={operator} visible={!isCollapsed} />
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </motion.aside>
  );
}
