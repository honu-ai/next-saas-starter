import React from 'react';

type FooterLinkItem = {
  label: string;
  path: string;
};

export type FooterProps = {
  companyName: string;
  description: string;
};

const Footer: React.FC<FooterProps> = ({ companyName, description }) => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Features', path: '#benefits' },
    { label: 'How it works', path: '#solution' },
    { label: 'FAQ', path: '#faq' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className='border-muted bg-background border-t px-4 py-12'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
          <div className='lg:col-span-2'>
            <div className='mb-4'>
              <a href='/' className='flex items-center'>
                <span className='font-poppins text-primary text-2xl font-bold'>
                  {companyName}
                </span>
              </a>
            </div>
            <p className='mb-4 max-w-xs'>{description}</p>
          </div>

          <div className='flex w-full justify-end lg:col-span-3'>
            <div className='flex w-full justify-start gap-8 md:justify-end'>
              <div className='min-w-32'>
                <h3 className='text-foreground mb-4 font-semibold'>Product</h3>
                <ul className='space-y-2'>
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.path}
                        className='hover:text-primary transition-colors'
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='border-muted flex flex-col items-center border-t pt-8 md:flex-row md:justify-between'>
          <p className='text-sm'>
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
          <a href='https://honu.ai' target='new'>
            <div className='flex w-full items-center justify-center gap-4 align-middle'>
              <p className='text-foreground text-sm font-medium'>
                Powered by Honu
              </p>

              <img
                className='h-14 w-14'
                src='/honu-logo.svg'
                alt='Honu Logo Image'
              />
            </div>
          </a>
          <div className='mt-4 flex space-x-4 md:mt-0'>
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className='hover:text-primary text-sm'
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
