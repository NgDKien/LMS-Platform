import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import Footer from '@/components/Footer';

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
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}