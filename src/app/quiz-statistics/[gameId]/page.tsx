import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs/server";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import ResultsCard from "@/components/QuizStatistic/ResultsCard";
import AccuracyCard from "@/components/QuizStatistic/AccuracyCard";
import TimeTakenCard from "@/components/QuizStatistic/TimeTakenCard";
import QuestionsList from "@/components/QuizStatistic/QuestionsList";
import { Database } from "../../../../database.types";

type Props = {
    params: Promise<{
        gameId: string;
    }>;
};

// Type cho questions từ query
type QuestionFromQuery = {
    id: string;
    question: string;
    options: any;
    answer: string;
    isCorrect: boolean | null;
    percentageCorrect: number | null;
    userAnswer: string | null;
};

// Type cho game từ query  
type GameWithQuestions = {
    id: string;
    gameType: "mcq" | "open_ended";
    topic: string;
    timeStarted: string;
    timeEnded: string | null;
    questions: QuestionFromQuery[];
};

const supabase = createClient();

const Statistics = async ({ params }: Props) => {
    const { gameId } = await params;

    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    // Lấy game + questions từ Supabase
    const { data: game, error } = await supabase
        .from("Game")
        .select(
            `
      id,
      gameType,
      topic,
      timeStarted,
      timeEnded,
      questions:Question (
        id,
        question,
        options,
        answer,
        isCorrect,
        percentageCorrect,
        userAnswer
      )
    `
        )
        .eq("id", gameId)
        .eq("userId", userId)
        .single();

    if (error || !game) {
        return redirect("/");
    }

    // Type assertion để đảm bảo type đúng
    const typedGame = game as unknown as GameWithQuestions;

    // Transform questions để match với QuestionsList component
    const transformedQuestions: Database["public"]["Tables"]["Question"]["Row"][] =
        typedGame.questions.map(q => ({
            ...q,
            questionType: typedGame.gameType,
            gameId: typedGame.id,
            created_at: null,
            updated_at: null,
        }));

    // Tính accuracy
    let accuracy = 0;

    if (typedGame.gameType === "mcq") {
        const totalCorrect = typedGame.questions.reduce(
            (acc: number, q) => acc + (q.isCorrect ? 1 : 0),
            0
        );
        accuracy = (totalCorrect / typedGame.questions.length) * 100;
    } else if (typedGame.gameType === "open_ended") {
        const totalPercentage = typedGame.questions.reduce(
            (acc: number, q) => acc + (q.percentageCorrect ?? 0),
            0
        );
        accuracy = totalPercentage / typedGame.questions.length;
    }

    accuracy = Math.round(accuracy * 100) / 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-zinc-950">
            <div className="p-8 mx-auto max-w-7xl">
                {/* Enhanced Header for Dark Mode */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Quiz Summary
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Chủ đề: <span className="font-semibold text-gray-100">{typedGame.topic}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Chế độ câu hỏi: <span className="capitalize font-medium text-gray-400">{typedGame.gameType.replace('_', ' ')}</span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/quiz-dashboard"
                            className={`${buttonVariants()} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 border-0`}
                        >
                            <LucideLayoutDashboard className="mr-2" size={18} />
                            Trở về Dashboard
                        </Link>
                    </div>
                </div>

                {/* Stats Grid with enhanced spacing */}
                <div className="grid gap-6 mb-8 md:grid-cols-10">
                    <ResultsCard accuracy={accuracy} />
                    <AccuracyCard accuracy={accuracy} />
                    <TimeTakenCard
                        timeEnded={new Date(typedGame.timeEnded ?? 0)}
                        timeStarted={new Date(typedGame.timeStarted ?? 0)}
                    />
                </div>

                {/* Questions List */}
                <QuestionsList questions={transformedQuestions} />
            </div>
        </div>
    );
};

export default Statistics;