import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Database, icons } from 'lucide-react';
import { Terminal } from './terminal';
import HeroSection from '@/components/hero-section';
import FeatureCard from '@/components/feature-card';
import content from '../../content.json';
import ProblemSection from '@/components/problem-section';
import SolutionSection from '@/components/solution-section';
import BenefitsSection from '@/components/benefits-section';
export default async function HomePage() {
  return (
    <main>
      <section>
        <HeroSection
          href={content.hero.href}
          ctaText={content.hero.ctaText}
          heroText={content.hero.heroText}
          heroDescriptionHeading={content.hero.heroDescriptionHeading}
          heroDescription={content.hero.heroDescription}
        />
      </section>
      <section>
        <ProblemSection
          title={content.problem.title}
          subtitle={content.problem.subtitle}
          result={content.problem.result}
          resultSubtitle={content.problem.resultSubtitle}
          cards={content.problem.cards.map((card) => ({
            title: card.title,
            description: card.description,
            icon: card.icon as keyof typeof icons,
          }))}
        />
      </section>
      <section>
        <SolutionSection
          badge={content.solution.badge}
          title={content.solution.title}
          subtitle={content.solution.subtitle}
          cta={content.solution.cta}
          steps={content.solution.steps}
        />
      </section>
      <section>
        <BenefitsSection
          badge={content.benefits.badge}
          title={content.benefits.title}
          description={content.benefits.description}
          cards={content.benefits.cards}
          bottomSection={content.benefits.bottomSection}
        />
      </section>
    </main>
  );
}
