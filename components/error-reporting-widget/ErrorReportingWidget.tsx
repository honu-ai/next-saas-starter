'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useErrorReporting,
  ErrorReport,
} from '@/lib/posthog/useErrorReporting';
import ErrorReportingOnboarding from '@/components/error-reporting-onboarding';
import { toast } from 'sonner';
import { Bug, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorReportingWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'auto';
  disableOnboarding?: boolean;
}

export function ErrorReportingWidget({
  className,
  position = 'bottom-right',
  size = 'medium',
  theme = 'auto',
  disableOnboarding = false,
}: ErrorReportingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<
    Omit<ErrorReport, 'timestamp' | 'url' | 'userAgent' | 'sessionId'>
  >({
    title: '',
    description: '',
    severity: 'medium',
    category: 'bug',
    additionalContext: {},
  });

  const { reportError, isReady } = useErrorReporting();

  // Listen for error reports from the global error boundary
  useEffect(() => {
    const handleErrorReport = (event: CustomEvent) => {
      const { title, description, severity, category, additionalContext } =
        event.detail;
      setFormData({
        title,
        description,
        severity,
        category,
        additionalContext,
      });
      setIsOpen(true);
    };

    window.addEventListener(
      'open-error-report',
      handleErrorReport as EventListener,
    );
    return () => {
      window.removeEventListener(
        'open-error-report',
        handleErrorReport as EventListener,
      );
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await reportError(formData);

      if (success) {
        toast.success(
          'Error report sent successfully! Thank you for your feedback.',
        );
        setFormData({
          title: '',
          description: '',
          severity: 'medium',
          category: 'bug',
          additionalContext: {},
        });
        setIsOpen(false);
      } else {
        toast.error('Failed to send error report. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while sending the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-20 right-6',
    'top-left': 'fixed top-20 left-6',
  };

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-14 h-14',
  };

  if (!isReady) {
    return null; // Don't render if PostHog is not ready
  }

  return (
    <TooltipProvider>
      <div className={cn(positionClasses[position], 'z-50', className)}>
        {!disableOnboarding && <ErrorReportingOnboarding delay={0} />}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className={cn(
                    sizeClasses[size],
                    'bg-background/80 hover:bg-background/90 rounded-full border-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105',
                    'border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700',
                  )}
                  aria-label='Report an issue or bug'
                >
                  <Bug className='h-5 w-5 text-red-600 dark:text-red-400' />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side='left' className='max-w-xs'>
              <div className='text-center'>
                <p className='font-medium'>Found a bug or have feedback?</p>
                <p className='mt-1 text-xs opacity-90'>
                  Click to report issues or share suggestions with our team
                </p>
              </div>
            </TooltipContent>
          </Tooltip>

          <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-red-600' />
                Report an Issue
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>
                  Issue Title <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='title'
                  placeholder='Brief description of the issue'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='bug'>🐛 Bug Report</SelectItem>
                    <SelectItem value='feature_request'>
                      ✨ Feature Request
                    </SelectItem>
                    <SelectItem value='performance'>
                      ⚡ Performance Issue
                    </SelectItem>
                    <SelectItem value='ui_ux'>🎨 UI/UX Issue</SelectItem>
                    <SelectItem value='other'>📝 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-3'>
                <Label>Severity</Label>
                <RadioGroup
                  value={formData.severity}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, severity: value }))
                  }
                  className='flex flex-wrap gap-4'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='low' id='low' />
                    <Label
                      htmlFor='low'
                      className='text-sm text-green-600 dark:text-green-400'
                    >
                      Low
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='medium' id='medium' />
                    <Label
                      htmlFor='medium'
                      className='text-sm text-yellow-600 dark:text-yellow-400'
                    >
                      Medium
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='high' id='high' />
                    <Label
                      htmlFor='high'
                      className='text-sm text-orange-600 dark:text-orange-400'
                    >
                      High
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='critical' id='critical' />
                    <Label
                      htmlFor='critical'
                      className='text-sm text-red-600 dark:text-red-400'
                    >
                      Critical
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>
                  Description <span className='text-red-500'>*</span>
                </Label>
                <Textarea
                  id='description'
                  placeholder="Please describe the issue in detail. Include steps to reproduce if it's a bug."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                />
              </div>

              <Card className='border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20'>
                <p className='text-sm text-blue-800 dark:text-blue-200'>
                  <strong>Note:</strong> This report will include your current
                  page URL and basic browser information to help us debug the
                  issue.
                </p>
              </Card>

              <div className='flex gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                  className='flex-1'
                >
                  <X className='mr-2 h-4 w-4' />
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex-1'
                >
                  {isSubmitting ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      Sending...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='mr-2 h-4 w-4' />
                      Send Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

export default ErrorReportingWidget;
