import React from 'react';
import { Clock, TrendingUp, Rocket, LucideIcon } from 'lucide-react';

// Define a type for the benefit card
type BenefitCard = {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
};

// Define a type for the bottom section
type BottomSection = {
  title: string;
  description: string;
};

// Update the props type to accept content from content.json
export type BenefitsSectionProps = {
  badge: string;
  title: string;
  description: string;
  cards: BenefitCard[];
  bottomSection: BottomSection;
};

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  badge,
  title,
  description,
  cards,
  bottomSection,
}) => {
  // Helper function to get the correct icon component based on icon name
  const getIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case 'Clock':
        return Clock;
      case 'TrendingUp':
        return TrendingUp;
      case 'Rocket':
        return Rocket;
      default:
        return Clock; // Default icon if not found
    }
  };

  return (
    <section className='bg-background px-4 py-16' id='features'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <span className='bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium md:text-lg'>
            {badge}
          </span>
          <h2
            className='text-foreground mt-4 mb-6 text-3xl font-bold md:text-4xl'
            dangerouslySetInnerHTML={{ __html: title }}
          ></h2>
          <p className='mx-auto max-w-2xl text-lg'>{description}</p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {cards.map((card, index) => {
            const IconComponent = getIcon(card.icon);
            return (
              <div
                key={index}
                className='hover:border-primary/50 border-border bg-card rounded-lg border p-6 shadow-lg transition duration-300'
              >
                <div className='bg-primary/20 mb-6 flex h-14 w-14 items-center justify-center rounded-full'>
                  <IconComponent className='text-primary h-6 w-6' />
                </div>
                <h3 className='text-foreground mb-3 text-xl font-semibold'>
                  {card.title}
                </h3>
                <p className='text-foreground mb-4'>{card.description}</p>
                <ul className='space-y-2'>
                  {card.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className='text-foreground flex items-center text-sm'
                    >
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className='bg-card hover:border-primary/50 border-border mt-16 rounded-lg border p-8'>
          <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-3'>
            <div className='col-span-2'>
              <h3 className='text-foreground mb-3 text-2xl font-semibold'>
                {bottomSection.title}
              </h3>
              <p className='text-foreground'>{bottomSection.description}</p>
            </div>
            <div className='flex justify-center md:justify-end'>
              <div className='flex items-center gap-2 md:gap-4'>
                <div className='bg-card flex h-16 w-16 items-center justify-center rounded-lg shadow-md md:h-20 md:w-20'>
                  <svg
                    className='text-primary h-8 w-8 md:h-10 md:w-10'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    />
                  </svg>
                </div>
                <div className='bg-card flex h-16 w-16 items-center justify-center rounded-lg shadow-md md:h-20 md:w-20'>
                  <svg
                    className='text-primary h-8 w-8 md:h-10 md:w-10'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                </div>
                <div className='bg-card flex h-16 w-16 items-center justify-center rounded-lg shadow-md md:h-20 md:w-20'>
                  <svg
                    className='text-primary h-8 w-8 md:h-10 md:w-10'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
