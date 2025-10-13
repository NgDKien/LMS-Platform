"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
    progress: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
    showPercentage?: boolean;
    label?: string;
    className?: string;
}

export function CourseProgress({
    progress,
    variant = "default",
    size = "default",
    showPercentage = true,
    label,
    className,
}: CourseProgressProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between gap-2 text-sm">
                {label && (
                    <span className="text-slate-400 font-medium">{label}</span>
                )}
                {showPercentage && (
                    <span className={cn(
                        "font-semibold tabular-nums",
                        progress === 0 && "text-slate-500",
                        progress > 0 && progress < 100 && "text-blue-400",
                        progress === 100 && "text-emerald-400"
                    )}>
                        {progress}%
                    </span>
                )}
            </div>
            <Progress
                value={progress}
                className={cn(
                    "h-2 transition-all bg-slate-800/50 border border-slate-700/50",
                    size === "sm" && "h-1",
                    // Màu cho phần đã hoàn thành
                    variant === "success" && progress > 0 && "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600",
                    variant === "default" && progress > 0 && "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-600",
                    // Thêm hiệu ứng khi hoàn thành 100%
                    progress === 100 && "[&>div]:shadow-lg [&>div]:shadow-emerald-500/50"
                )}
            />
        </div>
    );
}