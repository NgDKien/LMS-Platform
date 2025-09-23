import MCQ from "@/components/MCQ";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type Props = {
    params: Promise<{
        gameId: string;
    }>;
};

const supabase = createClient();

const MCQPage = async ({ params }: Props) => {
    const { gameId } = await params;
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    const { data: game, error } = await supabase
        .from("Game")
        .select(
            `
                id,
                gameType,
                topic,
                questions:Question (
                    id,
                    question,
                    options
                )
            `
        )
        .eq("id", gameId)
        .single();

    if (error || !game || game.gameType === "open_ended") {
        return redirect("/quiz");
    }

    return <MCQ game={game} />;
};

export default MCQPage;
