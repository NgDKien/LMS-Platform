// import DetailsDialog from "@/components/DetailsDialog";
import HistoryCard from "@/components/QuizDashboard/HistoryCard";
import HotTopicsCard from "@/components/QuizDashboard/HotTopicsCard";
import QuizMeCard from "@/components/QuizDashboard/QuizMeCard";
import RecentActivityCard from "@/components/QuizDashboard/RecentActivityCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Dashboard | Quizzzy",
    description: "Quiz yourself on anything!",
};

const Dasboard = async (props: Props) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center">
                <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
                {/* <DetailsDialog /> */}
            </div>

            <div className="grid gap-4 mt-4 md:grid-cols-2">
                <QuizMeCard />
                <HistoryCard />
            </div>
            <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
                {/* <HotTopicsCard /> */}
                <RecentActivityCard />
            </div>
        </main>
    );
};

export default Dasboard;