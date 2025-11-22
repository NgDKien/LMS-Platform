'use client';

import React from "react";
import { BarChart, ChevronRight, Loader2, Timer, Zap } from "lucide-react";
import { Database } from "../../database.types";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import z from "zod";
import { checkAnswerSchema } from "@/lib/quiz-question";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

type Game = Database["public"]["Tables"]["Game"]["Row"];
type Question = Database["public"]["Tables"]["Question"]["Row"];

type Props = {
  game: Pick<Game, "id" | "gameType" | "topic" | "timeStarted"> & {
    questions: Pick<Question, "id" | "options" | "question">[];
  };
};

const ringSize = 72; // px
const ringStroke = 6;

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number | null>(null);
  const [stats, setStats] = React.useState({ correct_answers: 0, wrong_answers: 0 });
  const [hasEnded, setHasEnded] = React.useState(false);
  const [now, setNow] = React.useState(new Date());
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => setIsMounted(true), []);

  const currentQuestion = React.useMemo(() => game.questions[questionIndex], [questionIndex, game.questions]);
  const options = React.useMemo(() => (currentQuestion?.options || []) as string[], [currentQuestion]);

  const { mutate: checkAnswer, isPending } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice!],
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  React.useEffect(() => {
    const tick = setInterval(() => {
      if (!hasEnded) setNow(new Date());
    }, 1000);
    return () => clearInterval(tick);
  }, [hasEnded]);

  const handleNext = React.useCallback(() => {
    if (selectedChoice === null) return toast.info("Select an option first!");

    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((s) => ({ ...s, correct_answers: s.correct_answers + 1 }));
          toast.success("Correct!", { description: "Nice one ✨" });
        } else {
          setStats((s) => ({ ...s, wrong_answers: s.wrong_answers + 1 }));
          toast.error("Wrong", { description: "Keep trying!" });
        }

        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
          return;
        }

        // micro delay to show selection effect
        setTimeout(() => {
          setSelectedChoice(null);
          setQuestionIndex((p) => p + 1);
        }, 420);
      },
    });
  }, [checkAnswer, questionIndex, game.questions.length, selectedChoice]);

  // keyboard handlers
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k >= "1" && k <= "4") {
        const idx = Number(k) - 1;
        if (idx < options.length) setSelectedChoice(idx);
      } else if (k === "Enter") {
        handleNext();
      } else if (k === "ArrowRight") {
        handleNext();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleNext, options.length]);

  // end screen
  if (hasEnded) {
    return (
      <main className="flex items-center justify-center min-h-full px-6">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="relative rounded-2xl p-8 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-600 shadow-2xl text-white"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl font-extrabold">🎉 Well Done!</div>
              <div className="text-sm text-indigo-100/80">
                Completed in{" "}
                {isMounted &&
                  formatTimeDelta(differenceInSeconds(now, new Date(game.timeStarted)))}
              </div>

              <div className="flex gap-8 mt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-200">{stats.correct_answers}</div>
                  <div className="text-xs text-white/80">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-200">{stats.wrong_answers}</div>
                  <div className="text-xs text-white/80">Wrong</div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 mt-6">
                <Link href={`/quiz-statistics/${game.id}`} className={cn(buttonVariants({ size: "lg" }), "bg-white text-black")}>
                  View Statistics <BarChart className="w-4 h-4 ml-2" />
                </Link>
                <button
                  onClick={() => {
                    // restart locally
                    setQuestionIndex(0);
                    setSelectedChoice(null);
                    setStats({ correct_answers: 0, wrong_answers: 0 });
                    setHasEnded(false);
                  }}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-black/20 border border-white/10 text-white hover:opacity-90"
                >
                  Play Again
                </button>
              </div>
            </div>
            {/* subtle glow */}
            <div className="pointer-events-none absolute -inset-1 rounded-2xl blur-3xl opacity-30 bg-gradient-to-r from-indigo-400 to-purple-400 mix-blend-screen" />
          </motion.div>
        </div>
      </main>
    );
  }

  // MAIN GAME UI (Game-like)
  return (
    <main className="flex items-center justify-center min-h-full px-6">
      <div className="w-full max-w-4xl">
        {/* Top HUD */}
        <div className="flex items-center justify-between mb-6">
          {/* left HUD: topic + ring timer */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400 uppercase tracking-wide">Topic</span>
              <div className="text-lg font-semibold text-white">{game.topic}</div>
            </div>

            {/* animated timer ring */}
            <TimerRing
              startTime={new Date(game.timeStarted)}
              now={now}
              size={ringSize}
              stroke={ringStroke}
            />
          </div>

          {/* center HUD: progress */}
          <div className="flex-1 px-6">
            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-400 shadow-[0_0_20px_rgba(139,92,246,0.18)] transition-all"
                style={{ width: `${((questionIndex + 1) / game.questions.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-zinc-400 mt-2 text-center">
              {questionIndex + 1} / {game.questions.length}
            </div>
          </div>

          {/* right HUD: score/card */}
          <div className="flex items-center gap-4">
            <MCQCounter correct_answers={stats.correct_answers} wrong_answers={stats.wrong_answers} />
          </div>
        </div>

        {/* Main play area */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: big question card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "backOut" }}
            className="col-span-1"
          >
            <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/70 to-zinc-900/50 border border-zinc-800 shadow-2xl p-6">
              {/* fancy header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 uppercase">Question</div>
                    <div className="text-lg font-semibold text-white">#{questionIndex + 1}</div>
                  </div>
                </div>

                <div className="text-sm text-zinc-400">
                  Time: {isMounted && formatTimeDelta(differenceInSeconds(now, new Date(game.timeStarted)))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ y: 10, opacity: 0, scale: 0.995 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <h2 className="text-2xl font-bold text-white leading-snug">
                    {currentQuestion.question}
                  </h2>

                  <p className="mt-4 text-sm text-zinc-400">Choose the best answer below.</p>
                </motion.div>
              </AnimatePresence>

              {/* subtle neon bottom glow */}
              <div className="absolute -bottom-10 -left-20 w-72 h-72 bg-gradient-to-r from-indigo-600/20 to-fuchsia-500/10 blur-3xl pointer-events-none" />
            </Card>
            <div className="flex justify-end mt-4">
              <Button
                size="lg"
                className="px-6 py-3 w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600"
                onClick={handleNext}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* RIGHT: options grid */}
          <div className="col-span-1 grid grid-cols-1 gap-4">
            <AnimatePresence>
              {options.map((opt, idx) => {
                const isSelected = selectedChoice === idx;
                return (
                  <motion.button
                    key={`${opt}-${idx}`}
                    initial={{ y: 10, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: isSelected ? 1.02 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.03 }}
                    onClick={() => setSelectedChoice(idx)}
                    className={cn(
                      "relative w-full text-left rounded-xl p-5 flex items-start gap-4 cursor-pointer border transition-all",
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white border-indigo-400 shadow-[0_8px_30px_rgba(99,102,241,0.18)]"
                        : "bg-zinc-800/60 border-zinc-700 hover:scale-[1.01] hover:bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "flex-none w-10 h-10 rounded-md flex items-center justify-center font-semibold text-sm",
                      isSelected ? "bg-white/10 border border-white/20" : "bg-zinc-900/40 border border-zinc-700"
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{opt}</div>
                      <div className="mt-2 text-xs text-zinc-400">Press {idx + 1}</div>
                    </div>

                    {/* floating check / indicator */}
                    <div className="flex-none ml-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isSelected ? "bg-white/10 border border-white/20" : "bg-transparent"
                      )}>
                        {isSelected ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : null}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MCQ;

/* ---------- TimerRing component (inline) ---------- */

function TimerRing({ startTime, now, size = 72, stroke = 6 }: { startTime: Date; now: Date; size?: number; stroke?: number }) {
  const elapsedSec = Math.max(0, differenceInSeconds(now, new Date(startTime)));
  const MAX = 3600;
  const pct = Math.min(1, elapsedSec / MAX);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} fill="transparent" />
          <circle
            r={radius}
            stroke="url(#g1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${dash} ${circumference - dash}`}
            transform="rotate(-90)"
            style={{ transition: "stroke-dasharray 0.35s ease" }}
          />
        </g>
      </svg>
      <div className="text-xs leading-none">
        <div className="text-sm font-semibold">{formatElapsedTime(elapsedSec)}</div>
        <div className="text-xs text-zinc-400">elapsed</div>
      </div>
    </div>
  );
}

/* ---------- small helper ---------- */
function formatElapsedTime(seconds: number) {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

