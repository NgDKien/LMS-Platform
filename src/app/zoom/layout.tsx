"use client";

import { ReactNode } from 'react';

import StreamVideoProvider from '@/components/providers/StreamClientProvider';

const ZoomLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <main>
            <StreamVideoProvider>{children}</StreamVideoProvider>
        </main>
    );
};

export default ZoomLayout;