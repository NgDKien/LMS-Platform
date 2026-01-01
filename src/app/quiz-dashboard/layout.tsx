'use client'

import AppHeaderQuiz from '@/components/AppHeaderQuiz';
import AppSidebar from '@/components/AppSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                <AppHeaderQuiz />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}