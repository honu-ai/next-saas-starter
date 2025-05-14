'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

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
};

const SolutionSection: React.FC<SolutionSectionProps> = ({
  badge,
  title,
  subtitle,
  cta,
  steps,
}) => {
  const firstHalf = steps.slice(0, 2);
  const secondHalf = steps.slice(2, 4);

  return (
    <section
      className='to-primary/2 dark:from-background/5 bg-gradient-to-b from-white px-4 py-16'
      id='how-it-works'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <span className='bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium'>
            {badge}
          </span>
          <h2
            className='text-primary-background mt-4 mb-6 text-3xl font-bold md:text-4xl'
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            {subtitle}
          </p>
        </div>

        <div className='mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <div>
            {firstHalf.map((step) => (
              <div
                key={step.number}
                className={`relative ${step.number < steps.length ? 'mb-6' : ''} bg-card rounded-lg p-6 shadow-lg`}
              >
                <div className='bg-primary text-primary-foreground absolute -top-3 -left-3 rounded px-3 py-1 text-sm font-medium'>
                  {step.number}
                </div>
                <h3 className='text-primary-background mb-3 text-xl font-semibold'>
                  {step.title}
                </h3>
                <p className='text-muted-foreground mb-4'>{step.description}</p>
              </div>
            ))}
          </div>

          <div>
            {secondHalf.map((step) => (
              <div
                key={step.number}
                className={`relative ${step.number < steps.length ? 'mb-6' : ''} bg-card rounded-lg p-6 shadow-lg`}
              >
                <div className='bg-primary text-primary-foreground absolute -top-3 -left-3 rounded px-3 py-1 text-sm font-medium'>
                  {step.number}
                </div>
                <h3 className='text-primary-background mb-3 text-xl font-semibold'>
                  {step.title}
                </h3>
                <p className='text-muted-foreground mb-4'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='text-center'>
          <Button variant='default' className='rounded-md px-6 py-6 text-lg'>
            {cta}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
