"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLessonAction } from "@/app/lms-actions/completeLessonAction";
import { uncompleteLessonAction } from "@/app/lms-actions/uncompleteLessonAction";
import { getLessonCompletionStatusAction } from "@/app/lms-actions/getLessonCompletionStatusAction";
import { cn } from "@/lib/utils";

interface LessonCompleteButtonProps {
    lessonId: string;
    clerkId: string;
}

export function LessonCompleteButton({
    lessonId,
    clerkId,
}: LessonCompleteButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
    const [isPendingTransition, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        startTransition(async () => {
            try {
                const status = await getLessonCompletionStatusAction(lessonId, clerkId);
                setIsCompleted(status);
            } catch (error) {
                console.error("Error checking lesson completion status:", error);
                setIsCompleted(false);
            }
        });
    }, [lessonId, clerkId]);

    const handleToggle = async () => {
        try {
            setIsPending(true);
            if (isCompleted) {
                await uncompleteLessonAction(lessonId, clerkId);
            } else {
                await completeLessonAction(lessonId, clerkId);
            }

            startTransition(async () => {
                //This func return true/false for UI update
                const newStatus = await getLessonCompletionStatusAction(
                    lessonId,
                    clerkId
                );
                setIsCompleted(newStatus);
            });

            router.refresh();
        } catch (error) {
            console.error("Error toggling lesson completion:", error);
        } finally {
            setIsPending(false);
        }
    };

    const isLoading = isCompleted === null || isPendingTransition;

    return (
        <div className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">
                        {isCompleted
                            ? "Lesson completed!"
                            : "Ready to complete this lesson?"}
                    </p>
                    <p className="text-sm text-slate-400">
                        {isCompleted
                            ? "You can mark it as incomplete if you need to revisit it."
                            : "Mark it as complete when you're done."}
                    </p>
                </div>
                <Button
                    onClick={handleToggle}
                    disabled={isPending || isLoading}
                    size="lg"
                    variant="default"
                    className={cn(
                        "min-w-[200px] transition-all duration-200 ease-in-out",
                        isCompleted
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isCompleted ? "Uncompleting..." : "Completing..."}
                        </>
                    ) : isCompleted ? (
                        <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Mark as Not Complete
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Complete
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}