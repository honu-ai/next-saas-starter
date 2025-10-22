import React from 'react';
import { Clock, TrendingUp, Rocket, LucideIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <section className='px-4 py-16' id='features'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-16 text-center'>
          <span className='bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium'>
            {badge}
          </span>
          <h2
            className='text-foreground mx-auto mt-4 mb-6 text-3xl font-bold md:text-4xl lg:max-w-4xl'
            dangerouslySetInnerHTML={{ __html: title }}
          ></h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            {description}
          </p>
        </div>

        <div className='mb-16 grid grid-cols-1 gap-6 lg:mx-auto lg:max-w-6xl lg:grid-cols-2'>
          {cards.map((card, index) => {
            const IconComponent = getIcon(card.icon);
            return (
              <div
                key={index}
                className={cn(
                  'bg-card border-border/30 h-full rounded-2xl border p-8 shadow-md transition-colors',
                  index >= 2 && 'lg:col-span-2',
                )}
              >
                <div className='flex h-full items-start gap-6'>
                  <div className='bg-primary/10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl'>
                    <IconComponent className='text-primary h-7 w-7' />
                  </div>
                  <div className='flex h-full flex-col'>
                    <div className='mb-3 flex items-center gap-3'>
                      <h3 className='text-2xl font-bold'>{card.title}</h3>
                    </div>
                    <p className='text-muted-foreground text-md mb-6 font-light'>
                      {card.description}
                    </p>
                    <div
                      className={cn(
                        'mt-auto grid gap-4 self-end sm:grid-cols-3',
                        index > 1 && 'self-start',
                      )}
                    >
                      {card.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className='bg-muted/60 flex items-start gap-2 rounded-lg p-3'
                        >
                          <Check className='text-primary mt-0.5 h-4 w-4 shrink-0' />
                          <span className='text-xs font-light'>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
