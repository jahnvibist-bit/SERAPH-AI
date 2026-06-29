'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Bell, ChevronDown, KeyRound, LogOut, Settings, SlidersHorizontal, User } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

const dropdownItems = [
  { label: 'Profile', icon: User },
  { label: 'Preferences', icon: SlidersHorizontal },
  { label: 'API Keys', icon: KeyRound },
  { label: 'Logout', icon: LogOut },
] as const;

const navVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: 'blur(4px)',
    transition: { duration: 0.14, ease: 'easeOut' },
  },
};

export function Navbar() {
  const [isCommanderOpen, setIsCommanderOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsCommanderOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed inset-x-0 top-0 z-50 h-[52px] min-h-[52px] max-h-[52px] overflow-visible border-b border-zinc-800/80 bg-[#060607] text-zinc-200 shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.28)]"
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center overflow-visible px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-4">
          <Logo size="sm" />

          <div className="hidden h-5 w-px bg-gradient-to-b from-transparent via-zinc-500/55 to-transparent sm:block" />

          <div className="hidden h-6 items-center gap-1.5 rounded-full border border-zinc-700/80 bg-zinc-950 px-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.35)]" />
            System Online
          </div>
        </div>

        <div className="min-w-0 flex-1" aria-hidden="true" />

        <div className="flex items-center gap-1.5 overflow-visible sm:gap-2">
          <motion.button
            type="button"
            whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.82)', color: '#E4E4E7' }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-zinc-500 outline-none transition-colors focus-visible:border-cyan-400/50 focus-visible:text-zinc-200"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={1.8} />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.82)', color: '#E4E4E7' }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-zinc-500 outline-none transition-colors focus-visible:border-cyan-400/50 focus-visible:text-zinc-200"
            aria-label="Settings"
          >
            <Settings size={17} strokeWidth={1.8} />
          </motion.button>

          <div ref={menuRef} className="relative h-9 overflow-visible">
            <motion.button
              type="button"
              whileHover={{
                backgroundColor: 'rgba(24, 24, 27, 0.96)',
                borderColor: 'rgba(113, 113, 122, 0.7)',
              }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={() => setIsCommanderOpen((current) => !current)}
              className="flex h-9 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/90 py-1 pl-1 pr-2 text-left outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors focus-visible:border-cyan-400/50"
              aria-haspopup="menu"
              aria-expanded={isCommanderOpen}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-zinc-600 bg-[linear-gradient(145deg,#A1A1AA_0%,#52525B_36%,#18181B_72%,#D4D4D8_100%)] text-[10px] font-semibold tracking-[0.08em] text-zinc-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]">
                C
              </span>
              <span className="hidden text-xs font-medium tracking-[0.08em] text-zinc-300 sm:inline">
                Commander
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={`text-zinc-500 transition-transform duration-200 ${
                  isCommanderOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {isCommanderOpen ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                  className="absolute right-0 z-[60] w-52 overflow-hidden rounded-lg border border-zinc-800 bg-[#0A0A0B] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.04)]"
                  style={{ top: 'calc(100% + 8px)' }}
                  role="menu"
                >
                  {dropdownItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-xs font-medium tracking-[0.04em] text-zinc-400 outline-none transition-colors hover:bg-zinc-900 hover:text-zinc-100 focus-visible:bg-zinc-900 focus-visible:text-zinc-100"
                        onClick={() => setIsCommanderOpen(false)}
                      >
                        <Icon size={15} strokeWidth={1.8} className="text-zinc-500" />
                        {item.label}
                      </button>
                    );
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
