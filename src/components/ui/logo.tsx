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
    sm: { width: 105, height: 35, maxHeight: 'max-h-[36px]' },
    md: { width: 135, height: 45, maxHeight: 'max-h-[46px]' },
    lg: { width: 175, height: 58, maxHeight: 'max-h-[58px]' },
    xl: { width: 220, height: 73, maxHeight: 'max-h-[74px]' },
  };

  const { width, height, maxHeight } = sizeMap[size];

  const content = (
    <div className={cn('relative inline-flex items-center select-none', className)}>
      <Image
        src="/logo.png"
        alt="Meetzy Club"
        width={width}
        height={height}
        priority
        className={cn(
          'h-auto w-auto object-contain transition-transform duration-200 hover:scale-105 mix-blend-multiply',
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
