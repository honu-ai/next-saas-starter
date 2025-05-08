'use client';

import React from 'react';
import Link from 'next/link';
import contentJson from '../../content.json';

export type LogoProps = {
  href?: string;
  brandName?: string;
};

const Logo: React.FC<LogoProps> = ({
  href = '/',
  brandName = contentJson.metadata.brandName,
}) => {
  const firstLetter = brandName.charAt(0);

  return (
    <Link href={href} className='relative z-10 flex items-center gap-2'>
      <div className='bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold'>
        {firstLetter}
      </div>
      <span className='text-foreground text-2xl font-bold'>{brandName}</span>
    </Link>
  );
};

export default Logo;
