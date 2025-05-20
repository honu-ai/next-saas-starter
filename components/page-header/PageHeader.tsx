'use client';

import React from 'react';
import Logo from '@/components/logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showBackLink?: boolean;
}

export function PageHeader({
  showBackLink = true,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn('border-b py-4', className)} {...props}>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between'>
          <Logo />

          {showBackLink && (
            <Link
              href='/'
              className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
