import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSectionProps = {
  title: string;
  subtitle: string;
  faqs?: FaqItem[];
};

const FaqSection: React.FC<FaqSectionProps> = ({ faqs, title, subtitle }) => {
  return (
    <section className='bg-muted px-4 py-16' id='faqs'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-12 text-center'>
          <span className='bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium md:text-lg'>
            FAQs
          </span>
          <h2 className='mt-4 mb-6 text-3xl font-bold md:text-4xl'>{title}</h2>
          <p className='text-muted-foreground'>{subtitle}</p>
        </div>

        <Accordion type='single' collapsible className='w-full'>
          {faqs?.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='text-foreground text-left text-lg font-medium md:text-2xl'>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground text-sm md:text-lg'>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {/* Hide the support link for now */}
        {/* <div className='mt-12 text-center'>
          <p className='text-muted-foreground mb-4'>
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href='#contact'
            className='text-primary hover:text-primary/80 inline-flex items-center font-medium'
          >
            Contact our support team
            <svg
              className='ml-2 h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M14 5l7 7m0 0l-7 7m7-7H3'
              />
            </svg>
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default FaqSection;
