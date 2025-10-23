'use client';

import { useState, useEffect } from 'react';
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
        <nav className='items-center space-x-1 md:flex'>{children}</nav>
      </div>
    </header>
  );
};

export default DashboardNav;
