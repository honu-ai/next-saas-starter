'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Shield, Activity, Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/settings', icon: Users, label: 'General' },
    { href: '/settings/activity', icon: Activity, label: 'Activity' },
    { href: '/settings/security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className='mx-auto flex min-h-[calc(100dvh-68px)] w-full max-w-7xl flex-col'>
      {/* Mobile header */}
      <div className='bg-background border-background/100 flex items-center justify-between border-b p-4 lg:hidden'>
        <div className='flex items-center'>
          <span className='font-medium'>Settings</span>
        </div>
        <Button
          className='-mr-3'
          variant='ghost'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className='h-6 w-6' />
          <span className='sr-only'>Toggle sidebar</span>
        </Button>
      </div>

      <div className='flex h-full flex-1 overflow-hidden'>
        {/* Sidebar */}
        <aside
          className={`bg-foreground border-accent lg:bg-background w-64 border-r lg:block ${isSidebarOpen ? 'block' : 'hidden'} absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <nav className='h-full overflow-y-auto p-4'>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={`my-1 w-full justify-start shadow-none ${pathname === item.href ? 'bg-background' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className='mr-2 h-4 w-4' />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className='flex-1 overflow-y-auto p-0 lg:p-4'>{children}</main>
      </div>
    </div>
  );
}
