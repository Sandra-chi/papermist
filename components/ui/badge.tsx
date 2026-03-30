import * as React from 'react';

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'soft' | 'outline';
}

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        tone === 'default' && 'bg-primary/12 text-primary',
        tone === 'soft' && 'bg-secondary text-secondary-foreground',
        tone === 'outline' && 'border border-border bg-white/70 text-foreground',
        className
      )}
      {...props}
    />
  );
}
