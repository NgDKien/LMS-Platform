'use client'
import React, { useState } from 'react';
import { Home, Layout, FolderOpen, ListTodo, Bell, Settings, Menu, Search, User } from 'lucide-react';
import { UserButton, useUser, useClerk } from '@clerk/nextjs';

export default function AppSidebar() {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const [isOpen, setIsOpen] = useState(true);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const menuItems = [
        {
            title: 'Home',
            icon: Home,
            href: '/lms-user-homepage',
        },
        {
            title: 'Quiz Generator',
            icon: Layout,
            href: '/quiz-dashboard',
        },
        {
            title: 'Code Editor',
            icon: FolderOpen,
            href: '/code_editor',
        },
        {
            title: 'Project Management Tool',
            icon: ListTodo,
            href: '/projects'
        },
    ];

    const bottomItems = [
        {
            title: 'My Courses',
            icon: Bell,
            href: '/my-courses',
        },
        {
            title: 'Profile',
            icon: User,
            href: '/profile',
        },
        {
            title: 'Manage Account',
            icon: Settings,
            onClick: () => openUserProfile(),
        },
    ];

    return (
        <>
            {/* Collapsed Sidebar */}
            {!isOpen && (
                <div className="flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)] mt-4 mb-4 ml-4">
                    <div className="w-16 bg-zinc-800 flex flex-col items-center py-4 gap-1 h-full rounded-2xl">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-10 h-10 mb-2 flex items-center justify-center text-white hover:bg-zinc-700 rounded-lg transition-all duration-150"
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        <button className="w-10 h-10 mb-3 flex items-center justify-center text-white hover:bg-zinc-700 rounded-lg transition-all duration-150">
                            <Search className="w-4 h-4" />
                        </button>

                        <div className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="relative">
                                        <button
                                            onMouseEnter={() => setHoveredItem(index)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            className="w-full h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-150"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>

                                        {hoveredItem === index && (
                                            <div className="absolute left-14 top-0 bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50">
                                                {item.title}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-zinc-700 w-10 my-2"></div>

                        <div className="flex flex-col gap-1 w-full px-2">
                            {bottomItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={index}
                                        className="w-full h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-150 relative"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-2 w-10 h-10 flex items-center justify-center">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Expanded Sidebar */}
            {isOpen && (
                <div className="w-64 flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)] mt-4 mb-4 ml-4">
                    <div className="bg-zinc-800 rounded-2xl h-full flex flex-col">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                                </div>
                                <span className="text-white text-sm">EduVerse</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <Menu className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-3 mb-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full bg-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2 pl-9 focus:outline-none focus:ring-1 focus:ring-zinc-600 placeholder:text-zinc-500"
                                />
                                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index}>
                                        <a
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-150 text-sm"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="border-t border-zinc-700 mx-3 my-2"></div>

                        <div className="px-3 space-y-0.5 mb-3">
                            {bottomItems.map((item, index) => {
                                const Icon = item.icon;
                                const isButton = !!item.onClick;

                                if (isButton) {
                                    return (
                                        <button
                                            key={index}
                                            onClick={item.onClick}
                                            className="w-full flex items-center justify-between px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-150 text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-4 h-4" />
                                                <span>{item.title}</span>
                                            </div>
                                        </button>
                                    );
                                }

                                return (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="flex items-center justify-between px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-all duration-150 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        <div className="p-3 border-t border-zinc-700">
                            <div className="flex items-center gap-3 px-2 py-2">
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-9 h-9",
                                            userButtonTrigger: "focus:shadow-none",
                                            userButtonPopoverCard: "shadow-xl",
                                            userButtonPopoverActionButton__manageAccount: "hidden"
                                        }
                                    }}
                                    showName={false}
                                    afterSignOutUrl="/"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm truncate">
                                        {user?.fullName || user?.firstName || 'User'}
                                    </p>
                                    <p className="text-zinc-500 text-xs truncate">
                                        {user?.primaryEmailAddress?.emailAddress || ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}