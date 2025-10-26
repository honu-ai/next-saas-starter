'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContactDialog } from '@/components/contact-form';
import { cn } from '@/lib/utils';

// Add interface to extend Window interface with dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export type HeroSectionProps = {
  href?: string;
  ctaText: string;
  heroText: string;
  heroDescriptionHeading: string;
  heroDescription: string;
  secondaryCtaText?: string;
  secondaryHref?: string;
  product?: boolean;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  href,
  ctaText,
  heroText,
  heroDescriptionHeading,
  heroDescription,
  secondaryCtaText = 'SIGN UP FOR FREE',
  secondaryHref,
  product,
}) => {
  return (
    <section className='dark:bg-background light relative overflow-hidden bg-white py-12 sm:py-16 md:py-20 lg:py-28'>
      {/* Grid background */}
      <div className='absolute inset-0 z-0 h-full w-full'>
        {/* Grid background with higher contrast */}
        <div
          className='absolute inset-0 h-full w-full'
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.09) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(99, 102, 241, 0.09) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        ></div>

        {/* Accent sections */}

        <div
          className={cn(
            'absolute top-0 left-0 h-full w-full',
            'bg-radial from-transparent from-30% to-white',
          )}
        />

        {/* <div className='absolute right-0 bottom-0 h-full w-1/6 bg-blue-50/30 dark:bg-blue-900/5'></div> */}
      </div>

      {/* Content */}
      <div className='relative z-10 container mx-auto max-w-5xl px-4'>
        <div className='text-center'>
          <p className='text-primary bg-primary/10 border-primary/15 m-auto mb-4 w-fit rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide sm:px-4 sm:py-2 sm:text-sm'>
            {heroDescriptionHeading.toUpperCase()}
          </p>
          <h1 className='text-bg dark:text-foreground mx-auto mb-6 text-3xl leading-tight font-bold sm:mb-8 md:max-w-lg md:text-5xl lg:max-w-2xl lg:text-6xl xl:max-w-3xl xl:text-7xl'>
            {heroText}
          </h1>
          <p className='text-muted-foreground mx-auto mb-8 max-w-3xl text-base sm:mb-12 sm:text-lg md:text-xl'>
            {heroDescription}
          </p>

          <div className='flex flex-col justify-center gap-4 sm:flex-row sm:gap-6'>
            <ContactDialog
              triggerText={ctaText}
              className='border-primary/30 md:text-md text-md w-auto px-12 py-8 md:px-14 md:py-8'
              product={product}
            />

            {secondaryHref && (
              <Link href={secondaryHref}>
                <Button
                  variant='outline'
                  size='lg'
                  className='bg-background/80 hover:bg-background w-full rounded-full border-2 px-6 py-5 text-sm font-medium shadow-md backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg sm:w-auto sm:px-8 sm:py-6 sm:text-base'
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
