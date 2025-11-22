'use client';

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import HistoryComponent from "../HistoryComponent";

const RecentActivityCard = () => {
    const { user } = useUser();
    const [quizCount, setQuizCount] = React.useState<number>(0);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!user?.id) return;

        const supabase = createClient();
        const fetchCount = async () => {
            const { count } = await supabase
                .from("Game")
                .select("*", { count: "exact", head: true })
                .eq("userId", user.id);
            setQuizCount(count || 0);
            setLoading(false);
        };
        fetchCount();
    }, [user]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-span-4 lg:col-span-3"
        >
            <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-800/70 to-zinc-900/40 border border-zinc-700/60 backdrop-blur-md 
                      rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:shadow-[0_0_35px_rgba(139,92,246,0.25)] transition-all duration-500 group">
                {/* glowing hover background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

                <CardHeader className="relative z-10 pb-3 flex ">
                    <div>
                        <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:opacity-90 transition">
                            <div>Recent Activity</div>
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-sm mt-1">
                            {loading
                                ? "Loading your activity..."
                                : `You have played a total of ${quizCount} quizzes.`}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700/70 scrollbar-track-transparent">
                    <HistoryComponent limit={10} userId={user?.id || ""} />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default RecentActivityCard;
