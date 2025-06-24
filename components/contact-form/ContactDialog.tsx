'use client';

import { useState, useRef } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type ContactDialogProps = {
  triggerText: string;
  title?: string;
  description?: string;
  showIcon?: boolean;
  className?: string;
  product?: boolean;
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
};

// Define the validation schema using Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name is too short' })
    .max(50, { message: 'Name is too long' })
    .regex(/^[a-zA-Z\s\-']+$/, { message: 'Name contains invalid characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactDialog: React.FC<ContactDialogProps> = ({
  triggerText,
  title = 'Join Our Early Access List',
  description = 'Get early access before the public launch. Limited slots available.',
  showIcon = true,
  className = '',
  variant = 'default',
  product,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [status, setStatus] = useState('');
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const validateField = (name: keyof ContactFormData, value: string) => {
    try {
      contactFormSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
        return false;
      }
      return true;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field
    validateField(name as keyof ContactFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    try {
      contactFormSchema.parse(formData);

      setStatus('Sending...');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});

        // Close the dialog
        if (dialogCloseRef.current) {
          dialogCloseRef.current.click();
        }

        // Show toast notification
        toast.success(
          'Thank you for your submission! We will be in touch soon.',
        );
      } else {
        setStatus('Error sending message.');
        toast.error(
          'There was an error sending your message. Please try again.',
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  if (product) {
    return (
      <Button
        variant={variant}
        size='lg'
        className={cn(
          `rounded-full border-2 px-6 py-5 text-sm font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:scale-[1.02] hover:shadow-xl sm:px-8 sm:py-6 sm:text-base`,
          className,
        )}
        asChild
      >
        <Link href='/pricing'>
          {triggerText}{' '}
          {showIcon && (
            <ArrowRight className='animate-pulse-gentle ml-2 h-4 w-4 sm:h-5 sm:w-5' />
          )}
        </Link>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size='lg'
          className={cn(
            `rounded-full border-2 px-6 py-5 text-sm font-medium shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:scale-[1.02] hover:shadow-xl sm:px-8 sm:py-6 sm:text-base`,
            className,
          )}
          onClick={() => {
            // Push event to Google Tag Manager dataLayer
            if (typeof window !== 'undefined' && window.dataLayer) {
              window.dataLayer.push({
                event: 'signup_button_click',
                buttonLocation: 'hero_section',
              });
            }
          }}
        >
          {triggerText}
          {showIcon && (
            <ArrowRight className='animate-pulse-gentle ml-2 h-4 w-4 sm:h-5 sm:w-5' />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-xl p-8 sm:max-w-[425px]'>
        <DialogHeader className='mb-4'>
          <DialogTitle className='text-xl font-bold'>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <Label htmlFor='name'>
              Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Your name'
              className={`bg-background w-full ${errors.name ? 'border-destructive' : ''}`}
              required
            />
            {errors.name && (
              <p className='text-destructive mt-1 text-xs'>{errors.name}</p>
            )}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='email'>
              Email <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Your email'
              type='email'
              className={`bg-background w-full ${errors.email ? 'border-destructive' : ''}`}
              required
            />
            {errors.email && (
              <p className='text-destructive mt-1 text-xs'>{errors.email}</p>
            )}
          </div>
          <div className='flex justify-between pt-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline' className='w-24'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' className='w-24'>
              Notify Me
            </Button>
          </div>

          {status && status !== 'Sent successfully!' && (
            <p
              className={`text-sm font-medium ${
                status === 'Sending...'
                  ? 'text-muted-foreground'
                  : 'text-destructive'
              }`}
            >
              {status}
            </p>
          )}

          {/* Hidden DialogClose that can be triggered programmatically */}
          <DialogClose ref={dialogCloseRef} className='hidden' />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
