import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

type Props = { accuracy: number };

const AccuracyCard = ({ accuracy }: Props) => {
    accuracy = Math.round(accuracy * 100) / 100;

    return (
        <Card className="md:col-span-3 bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-800/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 dark:bg-gradient-to-br dark:from-green-950/50 dark:to-emerald-950/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-green-800/30">
                <CardTitle className="text-xl font-bold text-green-100 dark:text-green-100">Average Accuracy</CardTitle>
                <div className="p-2 bg-green-900/50 rounded-full">
                    <Target className="text-green-400" size={20} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-green-300 dark:text-green-300">{accuracy.toString() + "%"}</div>
                <div className="w-full bg-green-900/30 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-green-400/50"
                        style={{ width: `${Math.min(accuracy, 100)}%` }}
                    ></div>
                </div>
                <p className="text-sm text-green-400 dark:text-green-400 font-medium">
                    {accuracy >= 90 ? "Excellent!" : accuracy >= 75 ? "Great job!" : accuracy >= 50 ? "Good work!" : "Keep practicing!"}
                </p>
            </CardContent>
        </Card>
    );
};

export default AccuracyCard;