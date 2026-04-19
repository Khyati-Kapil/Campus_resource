import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('glass-card p-6', className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)}>
    {children}
  </div>
);

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

export const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('flex items-center pt-4', className)}>
    {children}
  </div>
);
