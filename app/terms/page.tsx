'use client';

import { Container } from '@/components/ui/container';
import content from '../../content.json';
import { Separator } from '@/components/ui/separator';
import { Prose } from '@/components/ui/prose';
import { PageHeader } from '@/components/page-header';

export default function TermsPage() {
  return (
    <>
      <PageHeader />
      <Container className='py-8 md:py-12'>
        <div className='mx-auto max-w-3xl'>
          <h1 className='mb-6 text-3xl font-bold'>Terms of Service</h1>
          <Separator className='mb-6' />
          <Prose className='prose-headings:text-primary prose-headings:mb-4 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h3:text-xl prose-h3:font-medium prose-p:leading-relaxed prose-p:mb-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary/80 prose-a:transition-colors prose-a:duration-200 prose-strong:text-foreground prose-strong:font-semibold prose-ul:pl-5 prose-ul:mb-6 prose-ol:pl-5 prose-ol:mb-6 prose-li:mb-2 prose-li:marker:text-primary/70 prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:pl-4 prose-table:border prose-table:border-border prose-td:border prose-td:border-border prose-td:p-2 prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted dark:prose-invert dark:prose-headings:text-primary/90 dark:prose-a:text-primary/90 dark:hover:prose-a:text-primary max-w-none'>
            <div
              dangerouslySetInnerHTML={{ __html: content.terms_of_service }}
              className='[&>*]:text-foreground [&_a]:text-primary [&>table_th]:bg-muted [&>table_th]:border-border [&>table_td]:border-border dark:[&_a]:text-primary/90 dark:[&_a:hover]:text-primary [&_a]:transition-colors [&_a:hover]:underline [&>h1]:mt-8 [&>h1]:mb-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:mt-6 [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:font-semibold [&>h3]:mt-4 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-medium [&>li]:mb-2 [&>ol]:mb-6 [&>ol]:pl-5 [&>p]:mb-4 [&>p]:leading-relaxed [&>table]:my-6 [&>table]:block [&>table]:w-full [&>table]:border-collapse [&>table]:overflow-x-auto [&>table_td]:border [&>table_td]:p-2 [&>table_th]:border [&>table_th]:p-2 [&>table_th]:text-left [&>ul]:mb-6 [&>ul]:pl-5'
            />
          </Prose>
        </div>
      </Container>
    </>
  );
}
