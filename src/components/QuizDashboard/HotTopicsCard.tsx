'use client';

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import WordCloudCustom from "../WordCloudCustom";
import { createClient } from "@/utils/supabase/client";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

const HotTopicsCard = () => {
    const [topics, setTopics] = React.useState<{ topic: string; count: number }[]>(
        []
    );
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const supabase = createClient();

        const fetchTopics = async () => {
            const { data, error } = await supabase
                .from("topic_count")
                .select("topic, count")
                .order("count", { ascending: false })
                .limit(20);

            if (!error && data) setTopics(data);
            setLoading(false);
        };

        fetchTopics();
    }, []);

    const formattedTopics = topics.map((topic) => ({
        text: topic.topic,
        value: topic.count,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-span-4"
        >
            <Card className="relative overflow-hidden border border-zinc-700/60 bg-gradient-to-br from-zinc-800/70 to-zinc-900/40 backdrop-blur-md 
                      rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:shadow-[0_0_35px_rgba(139,92,246,0.25)] transition-all duration-500 group">
                {/* glowing background on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

                <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Hot Topics
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400/20 to-red-500/10 border border-orange-500/30">
                            <Flame
                                size={26}
                                className="text-orange-400 group-hover:text-red-400 transition-colors duration-300"
                            />
                        </div>
                    </div>
                    <CardDescription className="text-zinc-400 text-sm mt-1">
                        Click a topic to start a quiz 🔥
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 pl-2 mt-2 min-h-[200px] flex items-center justify-center">
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Loading hot topics...</p>
                    ) : topics.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No topics found.</p>
                    ) : (
                        <WordCloudCustom formattedTopics={formattedTopics} />
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default HotTopicsCard;
