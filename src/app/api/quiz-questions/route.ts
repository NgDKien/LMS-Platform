// /api/quiz-questions
import { strict_output } from "@/lib/gpt";
import { getQuestionsSchema } from "@/lib/quiz-question";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { amount, topic, type } = getQuestionsSchema.parse(body);
        let questions: any;

        if (type === "open_ended") {
            questions = await strict_output(
                "You are a helpful AI that generates question-answer pairs. You must return a valid JSON array format. Each answer should be maximum 30 words. IMPORTANT: option1, option2, and option3 must be DIFFERENT from the correct answer.",
                new Array(amount).fill(
                    `Generate a hard open-ended question about ${topic}`
                ),
                {
                    question: "question",
                    answer: "answer with max length of 30 words",
                }
            );
        } else if (type === "mcq") {
            questions = await strict_output(
                "You are a helpful AI that generates MCQ questions. You must return a valid JSON array format. Each answer and option should be maximum 30 words. IMPORTANT: option1, option2, and option3 must be DIFFERENT from the correct answer.",
                new Array(amount).fill(
                    `Generate a hard multiple choice question about ${topic}`
                ),
                {
                    question: "question",
                    answer: "answer with max length of 30 words",
                    option1: "option1 with max length of 30 words",
                    option2: "option2 with max length of 30 words",
                    option3: "option3 with max length of 30 words",
                }
            );
        }

        return NextResponse.json(
            {
                questions: questions,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.issues },
                {
                    status: 400,
                }
            );
        } else {
            console.error("API error", error);
            return NextResponse.json(
                { error: "An unexpected error occurred." },
                {
                    status: 500,
                }
            );
        }
    }
}