'use client'

import React from "react";
import { Progress } from "./ui/progress";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Props = { finished: boolean };

const loadingTexts = [
    "Generating questions...",
    "Unleashing the power of curiosity...",
    "Diving deep into the ocean of questions...",
    "Harnessing the collective knowledge of the cosmos...",
    "Igniting the flame of wonder and exploration...",
];

const LoadingQuestions = ({ finished }: Props) => {
    const [progress, setProgress] = React.useState(10);
    const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);

    React.useEffect(() => {
        const textInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * loadingTexts.length);
            setLoadingText(loadingTexts[randomIndex]);
        }, 2000);
        return () => clearInterval(textInterval);
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (finished) return 100;
                if (prev >= 100) return 0;
                return prev + (Math.random() < 0.15 ? 2 : 0.6);
            });
        }, 100);
        return () => clearInterval(interval);
    }, [finished]);

    return (
        <div className="flex items-center justify-center min-h-full bg-[#030712] text-zinc-100 px-6 relative overflow-hidden">
            {/* background glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/20 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center w-[85vw] sm:w-[60vw] md:w-[40vw]"
            >
                {/* Animated image */}
                <motion.div
                    initial={{ rotate: -5 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]"
                >
                    <Image
                        src="/loading.gif"
                        width={320}
                        height={320}
                        alt="Loading"
                        className="rounded-full"
                    />
                </motion.div>

                {/* Progress bar */}
                <Progress
                    value={progress}
                    className="w-full h-3 mt-6 bg-zinc-800/80 border border-zinc-700/60 overflow-hidden"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut" }}
                />

                {/* Dynamic text */}
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={loadingText}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6 text-lg md:text-xl font-medium text-zinc-300"
                    >
                        {loadingText}
                    </motion.h1>
                </AnimatePresence>

                {/* Finished text */}
                {finished && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 text-sm text-indigo-400"
                    >
                        Preparing your quiz...
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default LoadingQuestions;
