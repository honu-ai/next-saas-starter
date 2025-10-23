'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/logo';

export type DashboardNavProps = {
  children?: React.ReactNode;
};

const DashboardNav: React.FC<DashboardNavProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <nav className='hidden items-center space-x-1 md:flex'>{children}</nav>
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
        <nav className='container mx-auto px-4 py-6'>{children}</nav>
      </div>
    </header>
  );
};

export default DashboardNav;
