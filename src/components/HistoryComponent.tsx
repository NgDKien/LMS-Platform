'use client';

import { Clock, CopyCheck, Edit2, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { createClient } from "@/utils/supabase/client";

type Props = {
    limit: number;
    userId: string;
};

const HistoryComponent = ({ limit, userId }: Props) => {
    const [games, setGames] = React.useState<
        { id: string; gameType: string; topic: string; timeStarted: string; timeEnded: string }[]
    >([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        if (!userId) return;

        const supabase = createClient();

        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from("Game")
                .select("id, gameType, topic, timeStarted, timeEnded")
                .eq("userId", userId)
                .order("timeStarted", { ascending: false })
                .limit(limit);

            if (error) {
                setError(true);
            } else {
                setGames(data || []);
            }

            setLoading(false);
        };

        fetchHistory();
    }, [limit, userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-zinc-500 text-sm animate-pulse">Loading history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-red-400 text-sm">Failed to load history.</p>
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="p-4 bg-zinc-800/50 rounded-full">
                    <TrendingUp className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm">No quiz history yet</p>
                <p className="text-zinc-600 text-xs">Start your first quiz to see it here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {games.map((game) => (
                <div
                    key={game.id}
                    className="group relative bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 rounded-xl p-4 transition-all duration-300 hover:scale-[1.01]"
                >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Icon */}
                            <div
                                className={`p-2.5 rounded-lg flex-shrink-0 ${game.gameType === "mcq"
                                    ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                                    : "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                                    }`}
                            >
                                {game.gameType === "mcq" ? (
                                    <CopyCheck className="w-5 h-5 text-blue-400" />
                                ) : (
                                    <Edit2 className="w-5 h-5 text-purple-400" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <Link
                                    className="block text-base font-semibold text-white hover:text-blue-400 transition-colors truncate"
                                    href={`/quiz-statistics/${game.id}`}
                                >
                                    {game.topic}
                                </Link>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/50 rounded-lg text-xs text-zinc-300">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>
                                            {new Date(game.timeEnded ?? 0).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    {/* Type */}
                                    <span
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${game.gameType === "mcq"
                                            ? "bg-blue-500/10 text-blue-400"
                                            : "bg-purple-500/10 text-purple-400"
                                            }`}
                                    >
                                        {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* View Button */}
                        <Link
                            href={`/statistics/${game.id}`}
                            className="hidden sm:flex items-center justify-center px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-300 flex-shrink-0"
                        >
                            View
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryComponent;
