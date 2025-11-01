import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { TaskDetails } from '../TaskDetails';
import { HeaderSection } from '../TaskDetails/HeaderSection';
import { useTaskDetails } from './TaskDetailsContext';
import { X, Folder, Maximize2, ExternalLink } from 'lucide-react';

export const TaskDetailsDrawer = () => {
    const {
        selectedTask,
        projectName,
        isDrawerOpen,
        closeDrawer,
        updateTaskTitle,
    } = useTaskDetails();

    if (!selectedTask) return null;

    return (
        <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
            <SheetContent className="min-w-full sm:min-w-[550px] md:min-w-[750px] lg:min-w-[70%] bg-slate-950 border-l-0 overflow-hidden p-0 flex flex-col">
                {/* Gradient Overlay Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-slate-950 to-purple-500/5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>

                {/* Header Section - Glass Morphism */}
                <div className="relative z-20 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800/50 shadow-lg">
                    <SheetHeader className="px-8 py-6">
                        {/* Top Bar with Actions */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Folder className="w-5 h-5 text-white" />
                                </div>
                                <SheetDescription className="flex items-center m-0" asChild>
                                    <Badge
                                        variant="outline"
                                        className="text-sm px-4 py-1.5 bg-slate-800/50 backdrop-blur-sm text-slate-300 border-slate-700/50 hover:border-slate-600 transition-all font-medium"
                                    >
                                        {projectName}
                                    </Badge>
                                </SheetDescription>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    className="p-2.5 hover:bg-slate-800/50 rounded-lg transition-all group"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                </button>
                                <button
                                    className="p-2.5 hover:bg-slate-800/50 rounded-lg transition-all group"
                                    title="Fullscreen"
                                >
                                    <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                </button>
                                <div className="w-px h-6 bg-slate-700/50 mx-1"></div>
                                <button
                                    onClick={closeDrawer}
                                    className="p-2.5 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-lg transition-all group"
                                    title="Close"
                                >
                                    <X className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Task Title Section */}
                        <SheetTitle className="flex-1">
                            <div className="group">
                                <HeaderSection
                                    title={selectedTask.title || ''}
                                    taskId={selectedTask.id || ''}
                                    onTitleUpdate={
                                        updateTaskTitle
                                            ? (newTitle: string) =>
                                                updateTaskTitle(selectedTask.id || '', newTitle)
                                            : undefined
                                    }
                                />
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    {/* Decorative bottom border */}
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                </div>

                {/* Main Content - Scrollable */}
                <div className="relative flex-1 overflow-y-auto">
                    {/* Content wrapper with padding */}
                    <div className="px-8 py-6">
                        <TaskDetails />
                    </div>

                    {/* Scroll fade effect at bottom */}
                    <div className="sticky bottom-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none"></div>
                </div>

                {/* Subtle glow effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
            </SheetContent>
        </Sheet>
    );
};