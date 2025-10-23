import React from 'react';
import { icons } from 'lucide-react';

export type ProblemSectionProps = {
  title?: string;
  subtitle?: string;
  result?: string;
  resultSubtitle?: string;
  cards?: Array<{
    icon: keyof typeof icons;
    title: string;
    description: string;
  }>;
};

const ProblemSection: React.FC<ProblemSectionProps> = ({
  title = 'The Content Creation <span class="text-primary">Dilemma</span>',
  subtitle = 'Content marketing isn&apos;t working like it used to. The landscape has changed, but many teams haven&apos;t adapted.',
  result = 'The result?',
  resultSubtitle = 'Wasted budget, missed opportunities, and stalled growth.',
  cards,
}) => {
  return (
    <section className='text-foreground px-4 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 text-center'>
          <h2
            className='mb-6 text-3xl font-bold md:text-4xl'
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            {subtitle}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {cards?.map((card, index) => {
            const Icon = icons[card.icon];
            return (
              <div
                key={index}
                className='border-border/10 bg-muted-foreground/5 rounded-lg border p-6 backdrop-blur-sm transition duration-300'
              >
                <div className='bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Icon className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-3 text-xl font-semibold'>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            );
          })}
        </div>
        {/* 
        <div className='mt-12 text-center'>
          <p className='text-primary/80 mb-2 text-xl font-medium'>{result}</p>
          <h3 className='text-2xl font-bold md:text-3xl'>{resultSubtitle}</h3>
        </div> */}
      </div>
    </section>
  );
};

export default ProblemSection;
