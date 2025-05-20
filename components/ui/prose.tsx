import React from 'react';
import { cn } from '@/lib/utils';

interface ProseProps {
  className?: string;
  children: React.ReactNode;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        'prose prose-sm sm:prose lg:prose-lg prose-headings:font-bold prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-p:leading-relaxed',
        'prose-ul:pl-5 prose-ol:pl-5',
        'prose-img:rounded-md',
        'prose-hr:my-5',
        'prose-table:border-collapse',
        'max-w-none',
        'dark:prose-invert',
        className,
      )}
    >
      {children}
    </div>
  );
}
