'use client';

import React, { useEffect, useState } from 'react';
import { Lottie } from 'lottie-react';

interface LottiePlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
}

export function LottiePlayer({ src, className = '', style, loop = true }: LottiePlayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: '100%', height: '100%', ...style }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <Lottie
        src={src}
        autoplay
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
