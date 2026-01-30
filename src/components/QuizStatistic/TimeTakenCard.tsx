import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

type Props = {
    timeEnded: Date;
    timeStarted: Date;
};

const TimeTakenCard = ({ timeEnded, timeStarted }: Props) => {
    const timeDiff = differenceInSeconds(timeEnded, timeStarted);
    const formattedTime = formatTimeDelta(timeDiff);

    // Determine performance based on time (you can adjust thresholds)
    const getTimePerformance = (seconds: number) => {
        if (seconds < 60) return { color: "text-green-400", bg: "bg-green-900/30", border: "border-green-800/50", label: "Lightning Fast!" };
        if (seconds < 300) return { color: "text-blue-400", bg: "bg-blue-900/30", border: "border-blue-800/50", label: "Good Pace" };
        if (seconds < 600) return { color: "text-yellow-400", bg: "bg-yellow-900/30", border: "border-yellow-800/50", label: "Steady Progress" };
        return { color: "text-orange-400", bg: "bg-orange-900/30", border: "border-orange-800/50", label: "Take Your Time" };
    };

    const performance = getTimePerformance(timeDiff);

    return (
        <Card className={`md:col-span-3 bg-gradient-to-br from-purple-950/50 to-violet-950/50 border-purple-800/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-purple-800/30">
                <CardTitle className="text-xl font-bold text-purple-100">Thời gian đã chơi</CardTitle>
                <div className="p-2 bg-purple-900/50 rounded-full">
                    <Clock className="text-purple-400" size={20} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-purple-300">
                    {formattedTime}
                </div>
                <div className="space-y-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${performance.bg} ${performance.color} ${performance.border}`}>
                        {performance.label}
                    </div>
                    <div className="text-sm text-purple-400 space-y-1">
                        <div>Bắt đầu: {timeStarted.toLocaleTimeString()}</div>
                        <div>Kết thúc: {timeEnded.toLocaleTimeString()}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TimeTakenCard;