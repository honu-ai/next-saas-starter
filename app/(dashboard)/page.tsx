import HeroSection from '@/components/hero-section';
import content from '../../content.json';
import ProblemSection from '@/components/problem-section';
import SolutionSection from '@/components/solution-section';
import BenefitsSection from '@/components/benefits-section';
import FaqSection from '@/components/faq-section';
import CtaSection from '@/components/cta-section';
import Footer from '@/components/footer';
import { icons } from 'lucide-react';

export default async function HomePage() {
  return (
    <main className='light'>
      <section id='hero'>
        <HeroSection
          ctaText={content.hero.ctaText}
          heroText={content.hero.heroText}
          heroDescriptionHeading={content.hero.heroDescriptionHeading}
          heroDescription={content.hero.heroDescription}
          product={content.metadata.product}
        />
      </section>
      <section id='problem'>
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
      <section id='solution'>
        <SolutionSection
          badge={content.solution.badge}
          title={content.solution.title}
          subtitle={content.solution.subtitle}
          cta={content.solution.cta}
          steps={content.solution.steps}
          product={content.metadata.product}
        />
      </section>
      <section id='benefits'>
        <BenefitsSection
          badge={content.benefits.badge}
          title={content.benefits.title}
          description={content.benefits.description}
          cards={content.benefits.cards}
          bottomSection={content.benefits.bottomSection}
        />
      </section>
      <section id='faq'>
        <FaqSection
          faqs={content.faq.items}
          title={content.faq.title}
          subtitle={content.faq.subtitle}
        />
      </section>
      <section id='cta'>
        <CtaSection
          title={content.cta.title}
          description={content.cta.description}
          primaryButtonText={content.cta.primaryButtonText}
          secondaryButtonText={content.cta.secondaryButtonText}
          product={content.metadata.product}
        />
      </section>

      <section>
        <Footer
          companyName={content.footer.companyName}
          description={content.footer.description}
        />
      </section>
    </main>
  );
}
