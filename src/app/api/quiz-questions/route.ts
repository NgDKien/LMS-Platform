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
                "Bạn là một AI hữu ích tạo ra các cặp câu hỏi-câu trả lời bằng TIẾNG VIỆT. Bạn phải trả về định dạng JSON array hợp lệ. Mỗi câu trả lời phải tối đa 30 từ. QUAN TRỌNG: Tất cả nội dung phải bằng tiếng Việt.",
                new Array(amount).fill(
                    `Tạo một câu hỏi tự luận khó về chủ đề: ${topic}. Câu hỏi và câu trả lời phải bằng tiếng Việt.`
                ),
                {
                    question: "câu hỏi bằng tiếng Việt",
                    answer: "câu trả lời bằng tiếng Việt, tối đa 30 từ",
                }
            );
        } else if (type === "mcq") {
            questions = await strict_output(
                "Bạn là một AI hữu ích tạo ra các câu hỏi trắc nghiệm bằng TIẾNG VIỆT. Bạn phải trả về định dạng JSON array hợp lệ. Mỗi câu trả lời và lựa chọn phải tối đa 30 từ. QUAN TRỌNG: option1, option2, và option3 phải KHÁC với câu trả lời đúng. Tất cả nội dung phải bằng tiếng Việt.",
                new Array(amount).fill(
                    `Tạo một câu hỏi trắc nghiệm khó về chủ đề: ${topic}. Câu hỏi, câu trả lời và các lựa chọn phải bằng tiếng Việt.`
                ),
                {
                    question: "câu hỏi bằng tiếng Việt",
                    answer: "câu trả lời đúng bằng tiếng Việt, tối đa 30 từ",
                    option1: "lựa chọn 1 bằng tiếng Việt, tối đa 30 từ",
                    option2: "lựa chọn 2 bằng tiếng Việt, tối đa 30 từ",
                    option3: "lựa chọn 3 bằng tiếng Việt, tối đa 30 từ",
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
                { error: "Đã xảy ra lỗi không mong muốn." },
                {
                    status: 500,
                }
            );
        }
    }
}