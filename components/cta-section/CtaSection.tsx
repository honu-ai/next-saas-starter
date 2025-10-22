import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ContactDialog } from '@/components/contact-form';
export type CtaSectionProps = {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  disclaimerText?: string;
  product?: boolean;
  companyLogos?: Array<{
    src: string;
    alt: string;
  }>;
};

const CtaSection: React.FC<CtaSectionProps> = ({
  title = 'Ready to Create Content That <span class="text-primary">Actually Ranks</span>?',
  description = 'Join 1,200+ marketing professionals who are saving time and driving more organic traffic with RankWell. Start your 14-day free trial today.',
  primaryButtonText = 'Start Your 14-Day Free Trial',
  secondaryButtonText = 'Schedule a Demo',
  product,
}) => {
  return (
    <section className='overflow-hidden px-4 md:mb-14 lg:px-0'>
      <div className='relative mx-auto max-w-7xl rounded-4xl bg-slate-950 px-4 py-20'>
        {/* Abstract shapes */}
        <div className='pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden'>
          <div className='absolute top-10 left-10 h-32 w-32 rounded-full bg-blue-400/5 blur-xl'></div>
          <div className='absolute right-20 bottom-20 h-40 w-40 rounded-full bg-blue-200/5 blur-xl'></div>
          <div className='absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-blue-50/5 blur-lg'></div>
        </div>

        <div className='relative z-10 mx-auto max-w-4xl'>
          <div className='text-center'>
            <h2
              className='font-poppins mb-6 text-3xl font-bold text-white md:text-5xl'
              dangerouslySetInnerHTML={{ __html: title }}
            ></h2>
            <p className='mx-auto mb-10 max-w-2xl text-lg text-gray-300'>
              {description}
            </p>

            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <ContactDialog
                triggerText={primaryButtonText}
                className='bg-primary hover:bg-primary-600 text-md flex w-auto items-center gap-2 rounded-4xl border-none px-14 py-8 sm:w-auto lg:px-14 lg:py-8'
                product={product}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
