'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FlickeringFooter } from '@/components/ui/flickering-footer';

const Footer = () => {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return <FlickeringFooter />;
};

export default Footer;
