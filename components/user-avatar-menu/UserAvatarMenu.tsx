'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Home, LogOut, Settings, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/db/schema';
import { useTheme } from 'next-themes';

export type UserAvatarMenuProps = {
  user?: User | null;
  handleSignOut: () => void;
};

const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({
  user,
  handleSignOut,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className='size-9 cursor-pointer'>
          <AvatarImage alt={user?.name || ''} />
          <AvatarFallback className='bg-primary text-primary-foreground text-lg'>
            {user?.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='flex flex-col gap-1'>
        <DropdownMenuItem className='cursor-pointer'>
          <Link href='/dashboard' className='flex w-full items-center'>
            <Home className='mr-2 h-4 w-4' />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer'>
          <Link href='/settings' className='flex w-full items-center'>
            <Settings className='mr-2 h-4 w-4' />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={toggleTheme}>
          <div className='flex w-full items-center'>
            {isDarkMode ? (
              <Sun className='mr-2 h-4 w-4' />
            ) : (
              <Moon className='mr-2 h-4 w-4' />
            )}
            <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={handleSignOut} className='w-full'>
          <button type='submit' className='flex w-full'>
            <DropdownMenuItem className='w-full flex-1 cursor-pointer'>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatarMenu;
