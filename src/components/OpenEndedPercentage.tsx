import React from "react";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

type Props = {
    percentage: number;
};

const OpenEndedPercentage = ({ percentage }: Props) => {
    const display = Math.min(100, Math.max(0, Math.round(percentage)));

    return (
        <Card className="relative flex flex-col items-center justify-center px-6 py-4 border-none shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/80 rounded-2xl">
            <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-400 font-medium tracking-wide">
                    ACCURACY
                </span>
            </div>

            <div className="mt-2 flex items-end space-x-1">
                <span className="text-3xl font-bold text-white leading-none">
                    {display}
                </span>
                <span className="text-sm text-purple-400 mb-[2px]">%</span>
            </div>

            <div className="w-full mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${display}%` }}
                ></div>
            </div>
        </Card>
    );
};

export default OpenEndedPercentage;
