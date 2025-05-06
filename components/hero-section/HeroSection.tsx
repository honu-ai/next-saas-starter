import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedText from '../ui/animated-text';

export type HeroSectionProps = {
  href: string;
  ctaText: string;
  heroText: string;
  heroDescriptionHeading: string;
  heroDescription: string;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  href,
  ctaText,
  heroText,
  heroDescriptionHeading,
  heroDescription,
}) => {
  return (
    <section className='via-primary/5 to-primary/10 dark:from-background/10 bg-gradient-to-br from-white px-4 py-12 lg:py-20'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <div className='order-2 lg:order-1'>
            <AnimatedText
              text={heroText}
              tag='h1'
              className='text-primary mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl'
            />
            <div className='mb-8 max-w-xl'>
              <h2 className='mb-2 text-xl font-bold uppercase'>
                {heroDescriptionHeading}
              </h2>
              <p className='text-muted-foreground text-lg md:text-xl'>
                {heroDescription}
              </p>
            </div>

            <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
              <Link href={href}>
                <Button
                  variant='default'
                  className='flex items-center gap-2 rounded-md px-6 py-6 text-lg text-white'
                >
                  {ctaText}
                  <ArrowRight className='h-5 w-5' />
                </Button>
              </Link>
            </div>
          </div>
          <div className='order-1 flex justify-center lg:order-2'>
            <div className='relative w-full max-w-md'>
              <Image
                src='/lovable-uploads/e4fb8e09-e132-40be-8a39-2db72e3a9be5.png'
                alt='Hero image'
                width={500}
                height={400}
                className='w-full rounded-lg shadow-xl'
              />
              <div className='bg-primary/20 absolute -right-0 -bottom-0 -z-10 h-full w-full rounded-lg'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
