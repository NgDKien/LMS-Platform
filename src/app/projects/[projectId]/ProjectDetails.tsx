'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, LineChart, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Board } from './Board';
import { useProjectAccess } from '@/hooks/useProjectAccess';
import { ProjectAction } from '@/consts';

interface ProjectDetailsProps {
    projectName: string;
    projectId: string;
    statuses: IStatus[];
}

export const ProjectDetails = ({
    projectName,
    projectId,
    statuses,
}: ProjectDetailsProps) => {
    const { can } = useProjectAccess({ projectId });

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Modern Project Header */}
            <div className="flex-shrink-0 px-4 pt-4 pb-3">
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 
                    backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl
                    hover:border-zinc-600/50 transition-all duration-300">

                    {/* Gradient overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 
                        hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative flex items-center justify-between px-6 py-4 gap-6">
                        {/* Project Title Section */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            {/* Project Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                                flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/10">
                                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-400 to-purple-400" />
                            </div>

                            {/* Project Name */}
                            <div className="min-w-0">
                                <h1
                                    title={projectName}
                                    className="text-xl font-bold text-transparent bg-clip-text 
                                        bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-300 
                                        truncate tracking-tight"
                                >
                                    {projectName}
                                </h1>
                                <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Dự án đang hoạt động
                                </p>
                            </div>
                        </div>

                        {/* Actions Menu */}
                        {can(ProjectAction.VIEW_SETTINGS) && (
                            <div className="flex-shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none group">
                                        <div className="w-9 h-9 rounded-lg bg-zinc-800/50 border border-zinc-700/50 
                                            hover:bg-zinc-700/50 hover:border-zinc-600/50 
                                            flex items-center justify-center transition-all duration-200
                                            group-hover:scale-105">
                                            <Ellipsis className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-52 bg-zinc-900/95 backdrop-blur-xl border-zinc-800/50 
                                            shadow-2xl rounded-xl p-1.5"
                                        align="end"
                                    >
                                        <Link href={`/projects/${projectId}/settings`}>
                                            <DropdownMenuItem className="rounded-lg px-3 py-2.5 cursor-pointer
                                                text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50
                                                focus:bg-zinc-800/50 focus:text-zinc-100 transition-all duration-150
                                                group">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center
                                                            group-hover:bg-zinc-700/50 transition-colors">
                                                            <Settings className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium">Cài đặt</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 
                                                        -translate-x-1 group-hover:translate-x-0 transition-all" />
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Board Container - chiếm phần còn lại của màn hình */}
            <div className="h-[calc(100%-88px)] px-4 pb-4">
                <Board
                    projectId={projectId}
                    projectName={projectName}
                    statuses={statuses}
                />
            </div>
        </div>
    );
};