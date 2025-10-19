"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { avatarImages } from "@/consts";
import { toast } from "sonner";

interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    handleClick: () => void;
    link: string;
}

const MeetingCard = ({
    icon,
    title,
    date,
    isPreviousMeeting,
    buttonIcon1,
    handleClick,
    link,
    buttonText,
}: MeetingCardProps) => {

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-md transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]">
            {/* Gradient Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl -z-10"></div>

            <div className="relative p-6 flex flex-col gap-6 min-h-[280px]">
                {/* Header Section */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src={icon}
                            alt="meeting icon"
                            width={28}
                            height={28}
                            className="opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-100 transition-colors">
                            {title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="truncate">{date}</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

                {/* Action Buttons */}
                {!isPreviousMeeting && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <Button
                            onClick={handleClick}
                            className="group/btn relative flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 rounded-lg overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                            <span className="relative flex items-center justify-center gap-2 font-semibold">
                                {buttonIcon1 && (
                                    <Image src={buttonIcon1} alt="feature" width={18} height={18} />
                                )}
                                {buttonText}
                            </span>
                        </Button>

                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(link);
                                toast.success('Link Copied');
                            }}
                            className="group/btn relative h-11 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50 shadow-lg transition-all duration-300 rounded-lg overflow-hidden px-6"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                            <span className="relative flex items-center justify-center gap-2 font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingCard;