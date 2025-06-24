'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ContactDialog } from '@/components/contact-form';

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
    <section
      className='bg-slate-500/20 px-4 py-16 dark:bg-slate-800/20'
      id='how-it-works'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <span className='bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium md:text-lg'>
            {badge}
          </span>
          <h2
            className='text-primary-background mt-4 mb-6 text-3xl font-bold md:text-4xl'
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className='mx-auto max-w-2xl text-lg'>{subtitle}</p>
        </div>

        <div className='mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:grid-rows-2'>
          {steps.map((step) => (
            <div
              key={step.number}
              className='bg-card relative flex h-full flex-col rounded-lg p-6 shadow-lg'
            >
              <div className='bg-primary text-primary-foreground absolute -top-3 -left-3 rounded px-3 py-1 text-sm font-medium'>
                {step.number}
              </div>
              <h3 className='text-primary-background mb-3 text-xl font-semibold'>
                {step.title}
              </h3>
              <p className='text-muted-foreground'>{step.description}</p>
            </div>
          ))}
        </div>

        <div className='text-center'>
          <ContactDialog
            triggerText={cta}
            className='border-primary/30 w-full rounded-md px-6 py-6 text-lg sm:w-auto'
            product={product}
          />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
