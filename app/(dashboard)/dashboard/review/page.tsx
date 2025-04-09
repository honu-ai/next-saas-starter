'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CVDisplay, { type CVData } from '@/components/cv-display';
import MarkdownDownloadButton from '@/components/markdown-converter';
import PDFDownloadButton from '@/components/pdf-converter';

import { generatePDFFromCV, downloadPDF } from '@/lib/utils/pdf-generator';
import {
  convertCVToMarkdown,
  downloadMarkdown,
} from '@/lib/utils/markdown-converter';

const ReviewPage = () => {
  const [rewrittenCV, setRewrittenCV] = useState<CVData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the rewritten CV and job description from sessionStorage
    const storedCV = sessionStorage.getItem('rewrittenCV');
    const storedJobDescription = sessionStorage.getItem('jobDescription');

    console.log('Attempting to retrieve stored CV data');
    console.log('Stored CV exists:', !!storedCV);

    setIsLoading(false);

    if (!storedCV) {
      toast.error('No optimized CV found', {
        description: 'Please go back and complete the optimization process.',
      });
      router.push('/dashboard/job-description');
      return;
    }

    try {
      const parsedCV = JSON.parse(storedCV);
      console.log('Successfully parsed CV data:', parsedCV);
      setRewrittenCV(parsedCV);

      if (storedJobDescription) {
        setJobDescription(storedJobDescription);
      }
    } catch (error) {
      console.error('Error parsing stored CV data:', error);
      toast.error('Error loading CV data', {
        description: 'There was a problem loading your optimized CV.',
      });
    }
  }, [router]);

  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        Review & Download Your CV
      </h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <p className='mb-6 text-gray-600 dark:text-gray-300'>
          Your CV has been optimized based on the job description.
        </p>

        <div className='mb-8 rounded-md border border-gray-200 p-4 dark:border-gray-700'>
          <h2 className='mb-4 text-xl font-semibold'>Optimized CV Preview</h2>
          <div className='max-h-96 overflow-y-auto rounded-md bg-gray-50 p-4 dark:bg-gray-900'>
            <CVDisplay cv={rewrittenCV} isLoading={isLoading} />
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row sm:justify-end'>
          <MarkdownDownloadButton
            cv={rewrittenCV}
            onMarkdownDownload={(data) => {
              if (!data?.cv) return;

              const markdown = convertCVToMarkdown(data.cv);
              downloadMarkdown(markdown, data.filename);
            }}
          />
          <PDFDownloadButton
            cv={rewrittenCV}
            onPDFDownload={(data) => {
              if (!data?.cv) return;

              const pdfBlob = generatePDFFromCV(data.cv);
              downloadPDF(pdfBlob, data?.filename);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
