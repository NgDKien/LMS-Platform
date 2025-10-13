"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Library,
    ChevronRight,
    PlayCircle,
    X,
    Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
    GetCourseByIdQueryResult,
    GetCompletionsQueryResult,
    Module,
} from "../../../sanity.types";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CourseProgress } from "@/components/CourseProgress";
import { calculateCourseProgress } from "@/lib/courseProgress";

interface SidebarProps {
    course: GetCourseByIdQueryResult;
    completedLessons?: GetCompletionsQueryResult["completedLessons"];
}

export function Sidebar({ course, completedLessons = [] }: SidebarProps) {
    const pathname = usePathname();
    const { isOpen, toggle, close } = useSidebar();
    const [isMounted, setIsMounted] = useState(false);
    const [openModules, setOpenModules] = useState<string[]>([]);

    useEffect(() => {
        if (pathname && course?.modules) {
            const currentModuleId = course.modules.find((module) =>
                module.lessons?.some(
                    (lesson) =>
                        pathname ===
                        `/lms-course-dashboard/dashboard/courses/${course._id}/lessons/${lesson._id}`
                )
            )?._id;

            if (currentModuleId && !openModules.includes(currentModuleId)) {
                setOpenModules((prev) => [...prev, currentModuleId]);
            }
        }
    }, [pathname, course, openModules]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!course || !isMounted) {
        return null;
    }

    const progress = calculateCourseProgress(
        course.modules as unknown as Module[],
        completedLessons
    );

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Header Section */}
            <div className="p-4 lg:p-6 border-b border-slate-800/60 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <Link
                        href="/lms-user-homepage/my-courses"
                        className="flex items-center gap-x-2 text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <div className="flex items-center gap-x-2">
                            <Library className="h-4 w-4" />
                            <span>Course Library</span>
                        </div>
                    </Link>
                    <div className="space-x-2">
                        <Button
                            onClick={close}
                            variant="ghost"
                            className="lg:hidden -mr-2 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                            size="icon"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="font-semibold text-2xl text-slate-100 leading-tight">
                        {course.title}
                    </h1>
                    <CourseProgress
                        progress={progress}
                        variant="success"
                        label="Course Progress"
                    />
                </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
                <div className="p-2 lg:p-4">
                    <Accordion
                        type="multiple"
                        className="w-full space-y-3"
                        value={openModules}
                        onValueChange={setOpenModules}
                    >
                        {course.modules?.map((module, moduleIndex) => (
                            <AccordionItem
                                key={module._id}
                                value={module._id}
                                className={cn(
                                    "border-none rounded-lg overflow-hidden",
                                    moduleIndex % 2 === 0
                                        ? "bg-slate-900/50"
                                        : "bg-slate-900/30"
                                )}
                            >
                                <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-slate-800/40 transition-all duration-200 rounded-lg">
                                    <div className="flex items-center gap-x-3 lg:gap-x-4 w-full">
                                        <span className="text-sm font-bold text-blue-400/80 min-w-[32px] bg-slate-800/50 rounded-md px-2 py-1">
                                            {String(moduleIndex + 1).padStart(2, "0")}
                                        </span>
                                        <div className="flex flex-col gap-y-1 text-left flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-200 truncate">
                                                {module.title}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {module.lessons?.length || 0} lessons
                                            </p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-2">
                                    <div className="flex flex-col space-y-1">
                                        {module.lessons?.map((lesson, lessonIndex) => {
                                            const isActive =
                                                pathname ===
                                                `/lms-course-dashboard/dashboard/courses/${course._id}/lessons/${lesson._id}`;
                                            const isCompleted = completedLessons.some(
                                                (completion) => completion.lesson?._id === lesson._id
                                            );

                                            return (
                                                <Link
                                                    key={lesson._id}
                                                    prefetch={false}
                                                    href={`/lms-course-dashboard/dashboard/courses/${course._id}/lessons/${lesson._id}`}
                                                    onClick={close}
                                                    className={cn(
                                                        "flex items-center pl-8 lg:pl-10 pr-3 lg:pr-4 py-3 gap-x-3 lg:gap-x-4 group hover:bg-slate-800/50 transition-all duration-200 relative rounded-md mx-1",
                                                        isActive && "bg-blue-500/10 border-l-2 border-blue-500",
                                                        isCompleted && "opacity-70"
                                                    )}
                                                >
                                                    <span className="text-xs font-medium text-slate-600 min-w-[28px]">
                                                        {String(lessonIndex + 1).padStart(2, "0")}
                                                    </span>
                                                    {isCompleted ? (
                                                        <div className="h-5 w-5 shrink-0 rounded-full bg-green-500/20 flex items-center justify-center">
                                                            <Check className="h-3 w-3 text-green-400" />
                                                        </div>
                                                    ) : (
                                                        <PlayCircle
                                                            className={cn(
                                                                "h-5 w-5 shrink-0 transition-colors",
                                                                isActive
                                                                    ? "text-blue-400"
                                                                    : "text-slate-600 group-hover:text-blue-400"
                                                            )}
                                                        />
                                                    )}
                                                    <span
                                                        className={cn(
                                                            "text-sm line-clamp-2 min-w-0 transition-colors",
                                                            isActive
                                                                ? "text-blue-300 font-medium"
                                                                : "text-slate-400 group-hover:text-slate-200",
                                                            isCompleted &&
                                                            "text-slate-600 line-through decoration-green-500/40"
                                                        )}
                                                    >
                                                        {lesson.title}
                                                    </span>
                                                    {isActive && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <>
            {/* Thin Mobile Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 flex flex-col items-center w-[60px] border-r border-slate-800/60 bg-slate-950 lg:hidden py-4 gap-y-4">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/" prefetch={false}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 hover:bg-slate-800/50 text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                    <Library className="h-5 w-5" />
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-800 text-slate-200 border-slate-700">
                            <p>Course Library</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={toggle}
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 hover:bg-slate-800/50 text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <ChevronRight
                                    className={cn(
                                        "h-5 w-5 transition-transform duration-300",
                                        isOpen && "rotate-180"
                                    )}
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-800 text-slate-200 border-slate-700">
                            <p>Toggle Sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </aside>

            {/* Main Sidebar - Desktop & Mobile */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 bg-slate-950 transition-all duration-300 ease-in-out",
                    "lg:z-50 lg:block lg:w-96 lg:border-r lg:border-slate-800/60",
                    isOpen
                        ? "w-[calc(100%-60px)] translate-x-[60px] lg:translate-x-0 lg:w-96 shadow-2xl"
                        : "translate-x-[-100%] lg:translate-x-0"
                )}
            >
                <div className="h-full">
                    <SidebarContent />
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden"
                    onClick={close}
                />
            )}
        </>
    );
}