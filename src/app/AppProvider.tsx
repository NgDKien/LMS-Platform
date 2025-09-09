'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { Header } from '@/components/Header';

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {/* <div className="h-16">
          <Header />
        </div> */}
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}