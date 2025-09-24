import { createClient } from "@/utils/supabase/client";
import { checkAnswerSchema } from "@/lib/quiz-question";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";

const supabase = createClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, userInput } = checkAnswerSchema.parse(body);

    // 1. Lấy câu hỏi
    const { data: question, error: fetchError } = await supabase
      .from("Question")
      .select("*")
      .eq("id", questionId)
      .single();

    if (fetchError || !question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // 2. Update userAnswer
    const { error: updateAnswerError } = await supabase
      .from("Question")
      .update({ userAnswer: userInput })
      .eq("id", questionId);

    if (updateAnswerError) throw updateAnswerError;

    // 3. Nếu MCQ → so sánh chính xác
    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userInput.toLowerCase().trim();

      const { error: updateCorrectError } = await supabase
        .from("Question")
        .update({ isCorrect })
        .eq("id", questionId);

      if (updateCorrectError) throw updateCorrectError;

      return NextResponse.json({ isCorrect });
    }

    // 4. Nếu Open-ended → tính độ giống nhau %
    if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        question.answer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);

      const { error: updatePercentageError } = await supabase
        .from("Question")
        .update({ percentageCorrect: percentageSimilar })
        .eq("id", questionId);

      if (updatePercentageError) throw updatePercentageError;

      return NextResponse.json({ percentageSimilar });
    }

    // Nếu không thuộc loại nào
    return NextResponse.json(
      { message: "Invalid question type" },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
