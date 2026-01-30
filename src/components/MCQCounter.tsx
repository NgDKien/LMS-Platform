"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    correct_answers: number;
    wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
    return (
        <Card
            className="
        flex items-center justify-between gap-8 px-6 py-4
        bg-[#0d1117]/80 border border-[#202020]
        shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm
        rounded-xl text-white select-none
      "
        >
            {/* Correct */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#202020]">
                    <CheckCircle2 className="text-emerald-400" size={22} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                        Đúng
                    </span>
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={correct_answers}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-xl font-semibold text-emerald-400"
                        >
                            {correct_answers}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            <div className="h-10 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />

            {/* Wrong */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#202020]">
                    <XCircle className="text-rose-400" size={22} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                        Sai
                    </span>
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={wrong_answers}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-xl font-semibold text-rose-400"
                        >
                            {wrong_answers}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
};

export default MCQCounter;
