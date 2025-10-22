'use client';

import React from 'react';
import { ContactDialog } from '@/components/contact-form';
import { cn } from '@/lib/utils';

export type Step = {
  number: number;
  title: string;
  description: string;
};

export type SolutionSectionProps = {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  steps: Step[];
  product: boolean;
};

const SolutionSection: React.FC<SolutionSectionProps> = ({
  badge,
  title,
  subtitle,
  cta,
  steps,
  product,
}) => {
  return (
    <section className='px-4 py-16 dark:bg-slate-800/20' id='how-it-works'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <span className='bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium'>
            {badge}
          </span>
          <h2
            className='mt-6 mb-4 text-3xl font-bold md:text-5xl'
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            {subtitle}
          </p>
        </div>

        {/* Steps Grid with Dividers */}
        <div className='relative mb-16'>
          {/* Vertical center divider */}
          <div className='bg-border/70 border-border/50 absolute top-1/2 left-1/2 z-10 ml-[-0.05rem] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 lg:block' />

          {/* Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {steps.map((step, index) => {
              return (
                <div
                  key={step.number}
                  className={cn(
                    'border-border/70 relative border-dotted p-8',
                    'not-last:border-b-2',
                    'lg:odd:border-r-2',
                    'lg:nth-last-[-n+2]:border-b-0',
                  )}
                >
                  {/* Step Number Badge */}
                  <div className='bg-primary/10 text-primary mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                    {step.number}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className='mb-2 text-xl font-bold'>{step.title}</h3>
                    <p className='text-muted-foreground'>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className='text-center'>
          <ContactDialog
            triggerText={cta}
            className='border-primary/30 w-full rounded-full px-8 py-6 text-lg shadow-lg transition-all duration-300 hover:shadow-xl sm:w-auto'
            product={product}
          />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
