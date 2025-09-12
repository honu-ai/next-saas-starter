'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bug, MessageSquare, X, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorReportingOnboardingProps {
  className?: string;
}

export function ErrorReportingOnboarding({
  className,
}: ErrorReportingOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    // Check if user has seen the onboarding before
    const hasSeenKey = 'error-reporting-onboarding-seen';
    const seen = localStorage.getItem(hasSeenKey);

    if (!seen) {
      setHasSeenOnboarding(false);
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('error-reporting-onboarding-seen', 'true');
  };

  const handleGotIt = () => {
    handleDismiss();
  };

  if (hasSeenOnboarding) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Bug className='h-5 w-5 text-red-600' />
            Help Us Improve!
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
              <Bug className='h-8 w-8 text-red-600 dark:text-red-400' />
            </div>
            <h3 className='text-foreground mb-2 text-lg font-semibold'>
              Found a Bug or Have Feedback?
            </h3>
            <p className='text-muted-foreground text-sm'>
              We&apos;ve added a quick way for you to report issues and share
              feedback directly with our team.
            </p>
          </div>

          <Card className='border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'>
            <CardContent className='pt-4'>
              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-600'>
                    <Bug className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                      Look for the Red Bug Icon
                    </h4>
                    <p className='text-sm text-blue-700 dark:text-blue-300'>
                      You&apos;ll find it floating in the bottom-right corner of
                      your screen
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600'>
                    <MessageSquare className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                      Quick & Easy Reporting
                    </h4>
                    <p className='text-sm text-blue-700 dark:text-blue-300'>
                      Click it to report bugs, request features, or share any
                      feedback
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-600'>
                    <CheckCircle className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                      We&apos;ll Take Care of the Rest
                    </h4>
                    <p className='text-sm text-blue-700 dark:text-blue-300'>
                      Your feedback goes directly to our development team
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50'>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
              <span>
                Your privacy is protected - we only collect necessary technical
                details
              </span>
            </div>
          </div>

          <div className='flex gap-2 pt-2'>
            <Button
              variant='outline'
              onClick={handleDismiss}
              className='flex-1'
            >
              <X className='mr-2 h-4 w-4' />
              Maybe Later
            </Button>
            <Button onClick={handleGotIt} className='flex-1'>
              <CheckCircle className='mr-2 h-4 w-4' />
              Got It!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ErrorReportingOnboarding;
