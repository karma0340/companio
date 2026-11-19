import React from 'react';

interface StatusPulseProps {
  status?: 'active' | 'busy' | 'offline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  ping?: boolean;
}

export function StatusPulse({
  status = 'active',
  size = 'sm',
  className = '',
  ping = true,
}: StatusPulseProps) {
  const sizeMap = {
    xs: {
      wrapper: 'h-2 w-2',
      dot: 'h-2 w-2',
    },
    sm: {
      wrapper: 'h-2.5 w-2.5',
      dot: 'h-2.5 w-2.5',
    },
    md: {
      wrapper: 'h-3 w-3',
      dot: 'h-3 w-3',
    },
  };

  const colorMap = {
    active: {
      ping: 'bg-emerald-400',
      dot: 'bg-emerald-500',
    },
    busy: {
      ping: 'bg-amber-400',
      dot: 'bg-amber-500',
    },
    offline: {
      ping: 'bg-zinc-400',
      dot: 'bg-zinc-500',
    },
  };

  const { wrapper, dot } = sizeMap[size] || sizeMap.sm;
  const { ping: pingColor, dot: dotColor } = colorMap[status] || colorMap.active;

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${wrapper} ${className}`}
      aria-hidden="true"
    >
      {ping && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingColor}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${dot} ${dotColor}`} />
    </span>
  );
}
