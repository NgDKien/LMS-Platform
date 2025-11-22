// app/dashboard/page.tsx  (thay path nếu cần)
import HotTopicsCard from "@/components/QuizDashboard/HotTopicsCard";
import QuizMeCard from "@/components/QuizDashboard/QuizMeCard";
import RecentActivityCard from "@/components/QuizDashboard/RecentActivityCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNowStrict } from "date-fns";
import { Trophy } from "lucide-react";

export const metadata = {
    title: "Dashboard | Quizzzy",
    description: "Quiz yourself on anything!",
};

const Dashboard = async () => {
    const { userId } = await auth();
    if (!userId) return redirect("/");

    // Supabase quick stats (total quizzes, last quiz)
    const supabase = createClient();
    const [{ count }, lastQuiz] = await Promise.all([
        supabase.from("Game").select("*", { count: "exact", head: true }).eq("userId", userId),
        supabase
            .from("Game")
            .select("timeStarted")
            .eq("userId", userId)
            .order("timeStarted", { ascending: false })
            .limit(1),
    ]);

    const totalQuizzes: number = count ?? 0;
    const lastPlayedRaw = lastQuiz?.data && lastQuiz.data[0]?.timeStarted ? new Date(lastQuiz.data[0].timeStarted) : null;
    const lastPlayedText = lastPlayedRaw ? formatDistanceToNowStrict(lastPlayedRaw, { addSuffix: true }) : "—";

    return (
        <main className="min-h-screen bg-[#030712] text-zinc-100 pb-12">
            <div className="px-6 pt-8 max-w-7xl mx-auto">
                {/* Top hero: split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left big hero */}
                    <section className="lg:col-span-7">
                        <div className="rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-zinc-800/60 p-8 shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                        Welcome back — ready to level up?
                                    </h1>
                                    <p className="mt-3 text-zinc-400 max-w-xl">
                                        Create a quiz, practice topics you love, or check recent activity.
                                        Quizzzy will generate questions for you instantly — in dark mode, of course.
                                    </p>
                                </div>

                                {/* Right small summary cards */}
                                <aside className="hidden lg:flex lg:flex-col lg:items-end gap-4 w-64">
                                    <div className="w-full">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-zinc-800/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md bg-indigo-700/20 grid place-items-center">
                                                        <Trophy className="w-5 h-5 text-indigo-300" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-zinc-400">Total Quizzes</div>
                                                        <div className="text-2xl font-semibold">{totalQuizzes}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-xs text-zinc-500">Last played: <span className="text-zinc-300">{lastPlayedText}</span></div>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-zinc-800/50">
                                            <div className="text-xs text-zinc-400">Pro tip</div>
                                            <div className="mt-2 text-sm text-zinc-200">Use topics to focus practice — try “React” or “World History”.</div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                        <div className="rounded-2xl p-6 mt-6 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-zinc-800/50 shadow-lg">
                            <HotTopicsCard />
                        </div>
                    </section>

                    {/* Right column - compact widgets (on large screens) */}
                    <section className="lg:col-span-5">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-zinc-800/50 p-4 shadow-sm">
                                <h3 className="text-sm text-zinc-400 uppercase tracking-wider">Quick Actions</h3>
                                <div className="mt-3 grid grid-cols-1 gap-3">
                                    <QuizMeCard />
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-zinc-800/50 p-4">
                                <h3 className="text-sm text-zinc-400 uppercase tracking-wider">Recent activity</h3>
                                <div className="mt-3">
                                    {/* Render RecentActivityCard inside compact container */}
                                    <RecentActivityCard />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
