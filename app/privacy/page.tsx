'use client';

import { Container } from '@/components/ui/container';
import content from '../../content.json';
import { Separator } from '@/components/ui/separator';
import { Prose } from '@/components/ui/prose';
import { PageHeader } from '@/components/page-header';

export default function PrivacyPage() {
  return (
    <>
      <PageHeader />
      <Container className='py-8 md:py-12'>
        <div className='mx-auto max-w-3xl'>
          <h1 className='mb-6 text-3xl font-bold'>Privacy Policy</h1>
          <Separator className='mb-6' />
          <Prose>
            <div dangerouslySetInnerHTML={{ __html: content.privacy_policy }} />
          </Prose>
        </div>
      </Container>
    </>
  );
}
