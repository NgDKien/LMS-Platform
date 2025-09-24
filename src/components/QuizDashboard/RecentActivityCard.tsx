import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import HistoryComponent from "../HistoryComponent";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const RecentActivityCard = async () => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    const { count, error } = await supabase
        .from("Game")
        .select("*", { count: "exact", head: true })
        .eq("userId", userId);

    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    <Link href="/quiz-history">Recent Activity</Link>
                </CardTitle>
                <CardDescription>
                    You have played a total of {count ?? 0} quizzes.
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[580px] overflow-scroll">
                <HistoryComponent limit={10} userId={userId} />
            </CardContent>
        </Card>
    );
};

export default RecentActivityCard;
