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
  // Dimensions based on 1024x356 aspect ratio (~2.87:1)
  const sizeMap = {
    sm: { width: 115, height: 40 },
    md: { width: 145, height: 50 },
    lg: { width: 180, height: 63 },
    xl: { width: 220, height: 77 },
  };

  const { width, height } = sizeMap[size];

  const content = (
    <div className={cn('relative inline-flex items-center select-none', className)}>
      <Image
        src="/logo.png"
        alt="made4togethr"
        width={width}
        height={height}
        priority
        className="h-auto w-auto object-contain max-h-[56px] transition-transform duration-200 hover:scale-105 mix-blend-multiply"
      />
    </div>
  );

  if (href) {
    return <Link href={href} aria-label="made4togethr home">{content}</Link>;
  }

  return content;
}
