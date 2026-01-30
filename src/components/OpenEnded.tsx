"use client";
import React from "react";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Zap, Timer } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import OpenEndedPercentage from "./OpenEndedPercentage";
import BlankAnswerInput from "./BlankAnswerInput";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { checkAnswerSchema, endGameSchema } from "@/lib/quiz-question";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { Database } from "../../database.types";

type Game = Database["public"]["Tables"]["Game"]["Row"];
type Question = Database["public"]["Tables"]["Question"]["Row"];

type Props = {
  game: Pick<Game, "id" | "gameType" | "topic" | "timeStarted"> & {
    questions: Pick<Question, "id" | "answer" | "question">[];
  };
};

const OpenEnded = ({ game }: Props) => {
  const [hasEnded, setHasEnded] = React.useState(false);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState("");
  const [averagePercentage, setAveragePercentage] = React.useState(0);
  const [now, setNow] = React.useState(new Date());
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => setIsMounted(true), []);

  const currentQuestion = game.questions[questionIndex];

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        const el = input as HTMLInputElement;
        filledAnswer = filledAnswer.replace("_____", el.value);
        el.value = "";
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  React.useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast.info(`Câu trả lời của bạn đúng ${percentageSimilar}%`);
        setAveragePercentage((prev) => (prev + percentageSimilar) / (questionIndex + 1));
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      },
    });
  }, [checkAnswer, questionIndex, endGame, game.questions.length]);

  if (hasEnded) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-full bg-[#030712] px-4">
        <Card className="relative flex flex-col items-center justify-center w-full max-w-2xl py-12 px-8 text-center border border-indigo-500/40 bg-[#141b2d]/80 backdrop-blur-md shadow-[0_0_40px_rgba(99,102,241,0.25)]">
          {/* Glow background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl -z-10" />

          {/* Trophy */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-50 rounded-full" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#1a2138] border border-indigo-400/40 shadow-[0_0_25px_rgba(99,102,241,0.4)]">
              🏆
            </div>
          </div>

          {/* Congratulations Text */}
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Chúc mừng!
          </h1>

          {/* Time completed */}
          <div className="px-6 py-3 mt-6 text-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            Bạn đã hoàn thành trong{" "}
            <span className="font-bold text-white">
              {isMounted && formatTimeDelta(differenceInSeconds(now, new Date(game.timeStarted)))}
            </span>
          </div>

          {/* View Statistics Button */}
          <Link
            href={`/quiz-statistics/${game.id}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 px-8 py-3 text-lg font-semibold text-white rounded-xl",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
              "hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]",
              "transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(236,72,153,0.4)]"
            )}
          >
            Xem thống kê
            <BarChart className="w-5 h-5" />
          </Link>

          {/* Subtitle */}
          <p className="text-sm text-slate-400 mt-4">
            Bạn đã hoàn thành quiz! Xem lại thống kê để nắm được chỗ cần cải thiện.
          </p>
        </Card>
      </div>
    );
  }


  const elapsed = isMounted
    ? formatTimeDelta(differenceInSeconds(now, new Date(game.timeStarted)))
    : "0s";

  const progressPercent =
    ((questionIndex + 1) / game.questions.length) * 100;

  return (
    <div className="flex flex-col justify-center items-center min-h-full w-full px-4">
      {/* Header Info */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-gray-400 uppercase">Chủ đề</p>
            <h2 className="text-xl font-semibold text-indigo-400">{game.topic}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{elapsed} elapsed</p>
            <p className="text-sm text-gray-400">
              {questionIndex + 1} / {game.questions.length}
            </p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden mb-4">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <OpenEndedPercentage percentage={averagePercentage} />
      </div>

      {/* Question Card */}
      <Card className="w-full max-w-3xl border border-indigo-500/30 bg-[#0d1321]/90 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.15)]">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-400 font-medium">
              <Zap className="w-5 h-5" />
              <span>CÂU HỎI #{questionIndex + 1}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Timer className="w-4 h-4" />
              <span>{elapsed}</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {currentQuestion?.question}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            Điền vào chỗ trống.
          </CardDescription>
        </CardHeader>
        {/* Input + Button */}
        <div className="flex flex-col items-center justify-center w-full">
          <Card className="w-full max-w-3xl px-6 py-8 bg-[#13203d] backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <div className="flex flex-col items-center ">
              <BlankAnswerInput setBlankAnswer={setBlankAnswer} answer={currentQuestion.answer} />
            </div>
            <Button
              variant="default"
              disabled={isChecking || hasEnded}
              onClick={handleNext}
              className={cn(
                "w-full mt-8 h-12 text-lg font-semibold text-white rounded-xl transition-all duration-300",
                "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                "hover:from-indigo-400 hover:to-pink-400 hover:scale-[1.03] active:scale-[0.98]",
                "shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]"
              )}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Kiểm tra...
                </>
              ) : (
                <>
                  Tiếp tục
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default OpenEnded;
