'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/logo';

export type NavbarProps = {
  links: { label: string; path: string }[];
  children?: React.ReactNode;
};

const Navbar: React.FC<NavbarProps> = ({ links, children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Hide the main navbar on dashboard page
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboard) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto flex h-17 items-center justify-between px-4'>
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className='hidden items-center space-x-1 md:flex'>
          <ul className='flex space-x-1'>
            {links.map((item) => (
              <li key={item.label}>
                {pathname === item.path ? (
                  <span className='text-primary after:bg-primary relative rounded-md px-4 py-2 text-sm font-medium transition duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[calc(100%-1rem)] after:-translate-x-1/2'>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className='text-foreground/80 hover:text-foreground after:bg-primary relative rounded-md px-4 py-2 text-sm font-medium transition duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)]'
                    passHref
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {children}
        </nav>
        <div className='flex items-center md:hidden'>
          <div className='hidden md:block'>{children}</div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label='Toggle menu'
            className='ml-2'
          >
            {mobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`bg-background fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }}
      >
        <nav className='container mx-auto px-4 py-6'>
          <ul className='space-y-4'>
            {links.map((item) => (
              <li key={item.label}>
                {pathname === item.path ? (
                  <span className='text-primary after:bg-primary relative block w-full rounded-md px-4 py-3 text-lg font-medium transition duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[calc(100%-2rem)] after:-translate-x-1/2'>
                    {item.label}
                  </span>
                ) : (
                  <button
                    className='text-foreground after:bg-primary relative block w-full rounded-md px-4 py-3 text-lg font-medium transition duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-[calc(100%-2rem)] active:scale-95'
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(item.path);
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
            {children}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
