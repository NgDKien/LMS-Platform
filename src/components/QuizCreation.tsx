'use client'

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/lib/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { BookOpen, CopyCheck, Brain, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";
import { motion } from "framer-motion";

type Props = {
  topic: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post("/api/game", { amount, topic, type });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 3,
    },
  });

  const onSubmit = async (input: Input) => {
    setShowLoader(true);
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onSuccess: ({ gameId }: { gameId: string }) => {
          setFinishedLoading(true);
          setTimeout(() => {
            if (form.getValues("type") === "mcq") {
              router.push(`/play/mcq/${gameId}`);
            } else {
              router.push(`/play/open-ended/${gameId}`);
            }
          }, 2000);
        },
      }
    );
  };

  if (showLoader) return <LoadingQuestions finished={finishedLoading} />;

  return (
    <div className="min-h-full bg-[#030712] text-zinc-100 flex flex-col md:flex-row items-center justify-center gap-10 px-6 overflow-hidden relative">

      {/* Left Section (intro / hero) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-md space-y-6 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 text-indigo-400 font-medium">
          <Brain className="w-5 h-5" /> Quiz Generator
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Turn Any Topic Into a Fun Quiz
        </h1>

        <p className="text-zinc-400 text-sm md:text-base max-w-md">
          Instantly create engaging quizzes on any subject.
          Pick your topic, choose how many questions, and start playing!
        </p>

        <div className="flex justify-center md:justify-start">
          <Sparkles className="w-10 h-10 text-purple-400 animate-pulse drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
        </div>
      </motion.div>

      {/* Right Section (form) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/70 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-xl font-semibold text-zinc-100">
              Create Your Quiz
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Customize before you start 🚀
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Topic */}
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300 text-sm">
                        Topic
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a topic..."
                          className="bg-zinc-800/70 border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-zinc-100 placeholder-zinc-500 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-500 text-xs">
                        e.g. History, Coding, or Movies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300 text-sm">
                        Number of Questions
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3"
                          className="bg-zinc-800/70 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-zinc-100 placeholder-zinc-500"
                          {...field}
                          onChange={(e) =>
                            form.setValue("amount", parseInt(e.target.value))
                          }
                          min={1}
                          max={10}
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-500 text-xs">
                        Between 1 and 10
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type buttons */}
                {(() => {
                  const selectedType = form.watch("type");

                  return (
                    <div className="flex rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800/50">
                      <Button
                        variant={selectedType === "mcq" ? "default" : "ghost"}
                        className={`w-1/2 py-3 rounded-none transition-all duration-300 ${selectedType === "mcq"
                          ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-[1.02]"
                          : "text-zinc-400 hover:bg-zinc-700/60 hover:text-white"
                          }`}
                        onClick={() => form.setValue("type", "mcq")}
                        type="button"
                      >
                        <CopyCheck className="w-4 h-4 mr-2" /> MCQ
                      </Button>

                      <Separator orientation="vertical" className="bg-zinc-700" />

                      <Button
                        variant={selectedType === "open_ended" ? "default" : "ghost"}
                        className={`w-1/2 py-3 rounded-none transition-all duration-300 ${selectedType === "open_ended"
                          ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-[1.02]"
                          : "text-zinc-400 hover:bg-zinc-700/60 hover:text-white"
                          }`}
                        onClick={() => form.setValue("type", "open_ended")}
                        type="button"
                      >
                        <BookOpen className="w-4 h-4 mr-2" /> Open
                      </Button>
                    </div>
                  );
                })()}


                {/* Submit */}
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                  {isPending ? "Generating..." : "Start Quiz 🎯"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizCreation;
