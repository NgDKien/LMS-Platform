import OpenEnded from "@/components/OpenEnded";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { createClient } from "@/utils/supabase/client";

type Props = {
    params: Promise<{
        gameId: string;
    }>;
};

const supabase = createClient();

const OpenEndedPage = async ({ params }: Props) => {
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
                  timeStarted,
                  questions:Question (
                      id,
                      question,
                      answer
                  )
              `
        )
        .eq("id", gameId)
        .single();

    if (error || !game || game.gameType === "mcq") {
        return redirect("/quiz");
    }
    return <OpenEnded game={game} />;
};

export default OpenEndedPage;