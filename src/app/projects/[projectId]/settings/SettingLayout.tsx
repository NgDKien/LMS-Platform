'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
    ArrowDownNarrowWide,
    ArrowLeft,
    Kanban,
    LineChart,
    Menu,
    Proportions,
    Settings,
    Tags,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const navigationItems: (
    | 'separator'
    | {
        label: string;
        link: string;
        icon: JSX.Element;
    }
)[] = [
        {
            label: 'Cài đặt dự án',
            link: '/settings',
            icon: <Settings className="h-4 w-4" />,
        },
        {
            label: 'Quản lý quyền truy cập',
            link: '/settings/access',
            icon: <Users className="h-4 w-4" />,
        },
        'separator',
        {
            label: 'Quản lý nhãn',
            link: '/settings/labels',
            icon: <Tags className="h-4 w-4" />,
        },
        {
            label: 'Quản lý trạng thái',
            link: '/settings/statuses',
            icon: <Kanban className="h-4 w-4" />,
        },
        {
            label: 'Quản lý độ ưu tiên',
            link: '/settings/priorities',
            icon: <ArrowDownNarrowWide className="h-4 w-4" />,
        },
        {
            label: 'Quản lý phạm vi',
            link: '/settings/sizes',
            icon: <Proportions className="h-4 w-4" />,
        },
    ];

interface Props {
    title: string;
    children: ReactNode;
}

export const SettingsLayout = ({ title, children }: Props) => {
    const pathname = usePathname();
    const params = useParams();

    return (
        <div className="grid h-minus-80 w-full md:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col border-r border-zinc-800/70 backdrop-blur-md sticky top-4 h-[calc(100vh-2rem)]">
                <div className="flex items-center justify-between h-14 border-b border-zinc-800 px-5">
                    <Link
                        href={`/projects/${params.projectId}`}
                        className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Trở về</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigationItems.map((item, i) =>
                        item === 'separator' ? (
                            <Separator key={i} className="my-3 opacity-40" />
                        ) : (
                            <Link
                                key={item.link}
                                href={`/projects/${params.projectId}${item.link}`}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-all duration-150',
                                    pathname === `/projects/${params.projectId}${item.link}`
                                        ? 'bg-zinc-800/60 text-white shadow-sm'
                                        : ''
                                )}
                            >
                                <span className="text-zinc-400">{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex flex-col min-h-screen">
                <header className="flex h-14 items-center gap-4 border-b border-zinc-800  backdrop-blur-md px-4 md:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-zinc-300 hover:text-white"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="bg-zinc-900 border-zinc-800 text-zinc-300"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
                                <Link
                                    href={`/projects/${params.projectId}`}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Back</span>
                                </Link>
                                <Link href={`/projects/${params.projectId}/insights`}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-400 hover:text-white"
                                    >
                                        <LineChart className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <nav className="flex flex-col gap-1 text-base font-medium">
                                {navigationItems.map((item, i) =>
                                    item === 'separator' ? (
                                        <Separator key={i} className="my-2 opacity-40" />
                                    ) : (
                                        <Link
                                            key={item.link}
                                            href={`/projects/${params.projectId}${item.link}`}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-all duration-150',
                                                pathname === `/projects/${params.projectId}${item.link}`
                                                    ? 'bg-zinc-800 text-white'
                                                    : ''
                                            )}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    )
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-lg font-semibold text-white md:text-xl">
                        {title}
                    </h1>
                </header>

                <main className="flex-1 p-6 md:p-10 text-zinc-100">
                    <div className="max-w-5xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
};
