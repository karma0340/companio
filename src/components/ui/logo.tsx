import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  href?: string;
}

export function Logo({ size = 'md', className, href = '/' }: LogoProps) {
  // Dimensions based on 1024x341 aspect ratio (~3:1)
  const sizeMap = {
    sm: { width: 120, height: 40, maxHeight: 'max-h-[38px]' },
    md: { width: 156, height: 52, maxHeight: 'max-h-[48px] sm:max-h-[52px]' },
    lg: { width: 195, height: 65, maxHeight: 'max-h-[62px]' },
    xl: { width: 240, height: 80, maxHeight: 'max-h-[78px]' },
  };

  const { width, height, maxHeight } = sizeMap[size];

  const content = (
    <div className={cn('relative inline-flex items-center select-none', className)}>
      <Image
        src="/logo.png"
        alt="Meetzy Club — Meet • Connect • Belong"
        width={width}
        height={height}
        priority
        className={cn(
          'h-auto w-auto object-contain transition-transform duration-200 hover:scale-[1.03] mix-blend-multiply',
          maxHeight
        )}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Meetzy Club home">
        {content}
      </Link>
    );
  }

  return content;
}
