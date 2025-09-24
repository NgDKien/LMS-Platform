import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { createClient } from "@/utils/supabase/client";

type Props = {
    limit: number;
    userId: string;
};

const supabase = createClient();

const HistoryComponent = async ({ limit, userId }: Props) => {
    const { data: games, error } = await supabase
        .from("Game")
        .select("id, gameType, topic, timeStarted, timeEnded")
        .eq("userId", userId)
        .order("timeStarted", { ascending: false })
        .limit(limit);

    if (error || !games) {
        return <p className="text-red-500">Failed to load history.</p>;
    }

    return (
        <div className="space-y-8">
            {games.map((game) => (
                <div className="flex items-center justify-between" key={game.id}>
                    <div className="flex items-center">
                        {game.gameType === "mcq" ? (
                            <CopyCheck className="mr-3" />
                        ) : (
                            <Edit2 className="mr-3" />
                        )}
                        <div className="ml-4 space-y-1">
                            <Link
                                className="text-base font-medium leading-none underline"
                                href={`/statistics/${game.id}`}
                            >
                                {game.topic}
                            </Link>
                            <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryComponent;
