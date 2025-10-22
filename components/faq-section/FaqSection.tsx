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
    <section className='px-4 py-16' id='faqs'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-12 text-center'>
          <span className='bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium'>
            FAQs
          </span>
          <h2 className='mt-4 mb-6 text-3xl font-bold md:text-4xl'>{title}</h2>
          <p className='text-muted-foreground'>{subtitle}</p>
        </div>

        <Accordion
          type='single'
          collapsible
          defaultValue='item-0'
          className='mb-16'
        >
          {faqs?.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className='border-border/60 mb-4 rounded-4xl border-2 px-6 last:border-b'
            >
              <AccordionTrigger className='py-6 hover:no-underline'>
                <div className='flex items-center gap-4 text-left'>
                  <div>
                    <h3 className='text-lg font-bold'>{faq.question}</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pb-6'>
                <div>
                  <p className='text-muted-foreground'>{faq.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
