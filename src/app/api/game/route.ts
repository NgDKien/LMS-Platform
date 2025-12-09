import { createClient } from '@/utils/supabase/client';
import { quizCreationSchema } from "@/lib/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { auth } from '@clerk/nextjs/server';

const supabase = createClient();

export async function POST(req: Request) {
    try {
        // Get user from Clerk
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "You must be logged in to create a game." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { topic, type, amount } = quizCreationSchema.parse(body);

        // Create game using Supabase transaction
        const { data: game, error: gameError } = await supabase
            .from("Game")
            .insert([
                {
                    gameType: type,
                    timeStarted: new Date().toISOString(),
                    userId: userId,
                    topic: topic,
                },
            ])
            .select()
            .single();

        if (gameError) {
            console.error("Error creating game:", gameError);
            return NextResponse.json(
                { error: "Failed to create game." },
                { status: 500 }
            );
        }

        // Update topic count - try to get existing first
        const { data: existingTopic } = await supabase
            .from("topic_count")
            .select("count")
            .eq("topic", topic)
            .single();

        if (existingTopic) {
            // Update existing topic count
            const { error: updateError } = await supabase
                .from("topic_count")
                .update({
                    count: existingTopic.count + 1,
                    updated_at: new Date().toISOString()
                })
                .eq("topic", topic);

            if (updateError) {
                console.error("Error updating topic count:", updateError);
            }
        } else {
            // Insert new topic
            const { error: insertError } = await supabase
                .from("topic_count")
                .insert([{
                    topic: topic,
                    count: 1
                }]);

            if (insertError) {
                console.error("Error inserting topic count:", insertError);
            }
        }

        // Get questions from external API
        let questionsData;
        try {
            const { data } = await axios.post(
                `${process.env.API_URL as string}/api/quiz-questions`,
                {
                    amount,
                    topic,
                    type,
                }
            );
            questionsData = data;
        } catch (apiError) {
            // Clean up - delete the created game if questions API fails
            await supabase.from("Game").delete().eq("id", game.id);

            return NextResponse.json(
                { error: "Failed to generate questions." },
                { status: 500 }
            );
        }

        // Insert questions based on type
        if (type === "mcq") {
            type mcqQuestion = {
                question: string;
                answer: string;
                option1: string;
                option2: string;
                option3: string;
            };

            const questionsToInsert = questionsData.questions.map((question: mcqQuestion) => {
                // Mix up the options
                const options = [
                    question.option1,
                    question.option2,
                    question.option3,
                    question.answer,
                ].sort(() => Math.random() - 0.5);

                return {
                    question: question.question,
                    answer: question.answer,
                    options: options,
                    gameId: game.id,
                    questionType: "mcq",
                };
            });

            const { error: questionsError } = await supabase
                .from("Question")
                .insert(questionsToInsert)

            if (questionsError) {
                console.error("Error inserting MCQ questions:", questionsError);
                console.error("Questions data:", questionsToInsert);
                // Clean up - delete the created game
                await supabase.from("Game").delete().eq("id", game.id);

                return NextResponse.json(
                    { error: "Failed to create questions." },
                    { status: 500 }
                );
            }

        } else if (type === "open_ended") {
            type openQuestion = {
                question: string;
                answer: string;
            };

            const questionsToInsert = questionsData.questions.map((question: openQuestion) => ({
                question: question.question,
                answer: question.answer,
                gameId: game.id,
                questionType: "open_ended",
            }));

            const { error: questionsError } = await supabase
                .from("Question")
                .insert(questionsToInsert);

            if (questionsError) {
                console.error("Error inserting open-ended questions:", questionsError);
                // Clean up - delete the created game
                await supabase.from("Game").delete().eq("id", game.id);

                return NextResponse.json(
                    { error: "Failed to create questions." },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ gameId: game.id }, { status: 200 });

    } catch (error) {
        console.error("Unexpected error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                { error: "An unexpected error occurred." },
                { status: 500 }
            );
        }
    }
}
