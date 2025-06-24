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
    <section className='relative overflow-hidden bg-slate-950 px-4 py-20'>
      {/* Abstract shapes */}
      <div className='pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden'>
        <div className='bg-primary/10 absolute top-10 left-10 h-32 w-32 rounded-full blur-xl'></div>
        <div className='bg-primary-300/10 absolute right-20 bottom-20 h-40 w-40 rounded-full blur-xl'></div>
        <div className='bg-primary/5 absolute top-1/2 left-1/4 h-24 w-24 rounded-full blur-lg'></div>
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
              className='bg-primary hover:bg-primary-600 flex w-full items-center gap-2 rounded-md border-none px-6 py-6 text-lg sm:w-auto'
              product={product}
            />
            {/* <Button className='bg-primary hover:bg-primary-600 flex w-full items-center gap-2 rounded-md px-6 py-6 text-lg text-white sm:w-auto'>
              {primaryButtonText}
              <ArrowRight className='h-5 w-5' />
            </Button> */}
            {/* <Button
              variant='outline'
              className='w-full rounded-md px-6 py-6 text-lg sm:w-auto'
            >
              {secondaryButtonText}
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
