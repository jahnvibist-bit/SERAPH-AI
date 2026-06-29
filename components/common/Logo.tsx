'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    emblem: 28,
    wordmark: 'text-[13px]',
    tagline: 'text-[8px]',
    gap: 'gap-2',
    stackGap: 'gap-0.5',
    stroke: 1.1,
  },
  md: {
    emblem: 36,
    wordmark: 'text-[16px]',
    tagline: 'text-[9px]',
    gap: 'gap-3',
    stackGap: 'gap-1',
    stroke: 1,
  },
  lg: {
    emblem: 48,
    wordmark: 'text-[21px]',
    tagline: 'text-[11px]',
    gap: 'gap-4',
    stackGap: 'gap-1.5',
    stroke: 0.9,
  },
} as const;

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 4,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 3,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Logo({ size = 'md', showTagline = false, className }: LogoProps) {
  const uniqueId = useId().replace(/:/g, '');
  const config = sizeConfig[size];
  const titaniumGradientId = `seraph-titanium-${uniqueId}`;
  const shellGradientId = `seraph-shell-${uniqueId}`;
  const cyanGradientId = `seraph-cyan-${uniqueId}`;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -1,
        filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.16))',
      }}
      variants={containerVariants}
      className={cx(
        'group inline-flex select-none items-center align-middle',
        config.gap,
        className,
      )}
      aria-label={showTagline ? 'SERAPH AI Mission Control' : 'SERAPH AI'}
    >
      <motion.svg
        aria-hidden="true"
        variants={itemVariants}
        width={config.emblem}
        height={config.emblem}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
      >
        <defs>
          <linearGradient id={shellGradientId} x1="10" y1="7" x2="53" y2="57">
            <stop offset="0" stopColor="#F5F5F4" />
            <stop offset="0.24" stopColor="#9CA3AF" />
            <stop offset="0.52" stopColor="#F8FAFC" />
            <stop offset="0.76" stopColor="#71717A" />
            <stop offset="1" stopColor="#D4D4D8" />
          </linearGradient>
          <linearGradient id={titaniumGradientId} x1="18" y1="14" x2="46" y2="50">
            <stop offset="0" stopColor="#18181B" />
            <stop offset="0.48" stopColor="#0A0A0A" />
            <stop offset="1" stopColor="#27272A" />
          </linearGradient>
          <linearGradient id={cyanGradientId} x1="21" y1="20" x2="43" y2="44">
            <stop offset="0" stopColor="#67E8F9" stopOpacity="0.95" />
            <stop offset="1" stopColor="#06B6D4" stopOpacity="0.78" />
          </linearGradient>
          <filter id={`seraph-soft-shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>

        <motion.path
          d="M32 4.75 54.95 18v28L32 59.25 9.05 46V18L32 4.75Z"
          fill={`url(#${titaniumGradientId})`}
          stroke={`url(#${shellGradientId})`}
          strokeWidth={config.stroke}
          filter={`url(#seraph-soft-shadow-${uniqueId})`}
          vectorEffect="non-scaling-stroke"
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="transition-[stroke-width] duration-300"
        />
        <path
          d="M32 12.75 48.02 22v20L32 51.25 15.98 42V22L32 12.75Z"
          stroke="#A1A1AA"
          strokeOpacity="0.32"
          strokeWidth="0.85"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M32 18.5 43.69 25.25v13.5L32 45.5 20.31 38.75v-13.5L32 18.5Z"
          stroke={`url(#${cyanGradientId})`}
          strokeOpacity="0.68"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          className="transition-opacity duration-300 group-hover:opacity-90"
        />
        <path
          d="M32 22.25 40.44 37.75H23.56L32 22.25Z"
          fill={`url(#${shellGradientId})`}
          fillOpacity="0.92"
        />
        <path
          d="M32 27.8 36.12 35.38h-8.24L32 27.8Z"
          fill="#09090B"
          fillOpacity="0.92"
        />
        <circle cx="32" cy="38.4" r="2.15" fill={`url(#${cyanGradientId})`} />
        <path
          d="M32 9.25v6.2M32 48.55v6.2M12.7 21.25l5.38 3.1M45.92 39.65l5.38 3.1M51.3 21.25l-5.38 3.1M18.08 39.65l-5.38 3.1"
          stroke="#E4E4E7"
          strokeOpacity="0.38"
          strokeWidth="0.7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>

      <motion.div variants={itemVariants} className={cx('flex min-w-0 flex-col', config.stackGap)}>
        <div
          className={cx(
            'flex items-baseline whitespace-nowrap font-semibold leading-none tracking-[0.18em]',
            config.wordmark,
          )}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(112deg, #71717A 0%, #3F3F46 24%, #A1A1AA 45%, #27272A 68%, #52525B 100%)`,
            }}
          >
            SERAPH
          </span>
          <span
            className="ml-[0.55em] bg-clip-text font-semibold text-transparent"
            style={{
              backgroundImage: `linear-gradient(112deg, #71717A 0%, #3F3F46 24%, #A1A1AA 45%, #27272A 68%, #52525B 100%)`,
            }}
          >
            AI
          </span>
        </div>

        {showTagline ? (
          <motion.span
            variants={itemVariants}
            className={cx(
              'whitespace-nowrap font-medium uppercase leading-none tracking-[0.28em] text-zinc-500',
              config.tagline,
            )}
          >
            Mission Control
          </motion.span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
