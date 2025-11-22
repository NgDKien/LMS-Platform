"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const QuizMeCard = () => {
    const router = useRouter();

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
            <Card
                onClick={() => router.push("/quiz")}
                className="group relative overflow-hidden border border-zinc-700 bg-gradient-to-br from-zinc-700/70 to-zinc-600/40 backdrop-blur-md 
                rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.15)] cursor-pointer transition-all duration-300"
            >
                {/* glowing background blur */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />

                <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        Quiz Me!
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition">
                        <BrainCircuit
                            size={30}
                            strokeWidth={2.4}
                            className="text-indigo-400 group-hover:text-purple-400 transition-colors duration-300"
                        />
                    </div>
                </CardHeader>

                <CardContent className="relative z-10">
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Challenge yourself with a personalized quiz on any topic.
                        <br />
                        <span className="text-zinc-500 italic">
                            Tap to start your brain workout 🧠
                        </span>
                    </p>

                    {/* decorative gradient line */}
                    <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default QuizMeCard;
