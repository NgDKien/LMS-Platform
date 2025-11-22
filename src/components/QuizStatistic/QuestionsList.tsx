"use client";
import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Database } from "../../../database.types";

type Question = Database["public"]["Tables"]["Question"]["Row"];

type Props = {
    questions: Question[];
};

const QuestionsList = ({ questions }: Props) => {
    const getStatusIcon = (question: Question) => {
        if (question.questionType === "open_ended") {
            const percentage = question.percentageCorrect || 0;
            if (percentage >= 80) return <CheckCircle className="text-green-400" size={18} />;
            if (percentage >= 60) return <AlertCircle className="text-yellow-400" size={18} />;
            return <XCircle className="text-red-400" size={18} />;
        } else {
            return question.isCorrect ?
                <CheckCircle className="text-green-400" size={18} /> :
                <XCircle className="text-red-400" size={18} />;
        }
    };

    return (
        <div className="mt-8">
            <Card className="overflow-hidden bg-gray-900/50 border-gray-800">
                <CardHeader className="bg-gradient-to-r from-gray-900/70 to-slate-900/70 border-b border-gray-800">
                    <CardTitle className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                        <AlertCircle className="text-blue-400" size={24} />
                        Question Review
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                        Review your answers and see where you can improve
                    </p>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-800/50 hover:bg-gray-800/70 border-gray-700">
                                <TableHead className="w-16 text-center font-semibold text-gray-300">No.</TableHead>
                                <TableHead className="font-semibold text-gray-300">Question & Correct Answer</TableHead>
                                <TableHead className="font-semibold text-gray-300">Your Answer</TableHead>
                                <TableHead className="w-20 text-left font-semibold text-gray-300">Status</TableHead>
                                {questions[0]?.questionType === "open_ended" && (
                                    <TableHead className="w-24 text-center font-semibold text-gray-300">Score</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.map((question, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-gray-800/30 transition-colors duration-200 border-b border-gray-800"
                                >
                                    <TableCell className="font-bold text-gray-100 text-center">
                                        {index + 1}
                                    </TableCell>

                                    <TableCell className="max-w-md">
                                        <div className="space-y-3">
                                            <div className="text-gray-100 font-medium leading-relaxed">
                                                {question.question}
                                            </div>
                                            <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-3">
                                                <div className="text-xs text-green-400 font-semibold uppercase tracking-wide mb-1">
                                                    Correct Answer
                                                </div>
                                                <div className="text-green-200 font-medium">
                                                    {question.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-md">
                                        {question.questionType === "open_ended" ? (
                                            <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-3">
                                                <div className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">
                                                    Your Response
                                                </div>
                                                <div className="text-blue-200 font-medium">
                                                    {question.userAnswer || "No answer provided"}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`border rounded-lg p-3 ${question.isCorrect
                                                ? 'bg-green-950/30 border-green-800/50'
                                                : 'bg-red-950/30 border-red-800/50'
                                                }`}>
                                                <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${question.isCorrect ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                    Your Answer
                                                </div>
                                                <div className={`font-medium ${question.isCorrect ? 'text-green-200' : 'text-red-200'
                                                    }`}>
                                                    {question.userAnswer || "No answer provided"}
                                                </div>
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {getStatusIcon(question)}
                                    </TableCell>

                                    {question.percentageCorrect !== null && question.percentageCorrect !== undefined && (
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${question.percentageCorrect >= 80
                                                ? 'bg-green-950/50 text-green-300 border-green-800/50'
                                                : question.percentageCorrect >= 60
                                                    ? 'bg-yellow-950/50 text-yellow-300 border-yellow-800/50'
                                                    : 'bg-red-950/50 text-red-300 border-red-800/50'
                                                }`}>
                                                {question.percentageCorrect}%
                                            </span>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption className="py-4 bg-gray-900/30 text-gray-400 font-medium border-t border-gray-800">
                            🎯 End of quiz review • Keep practicing to improve your scores!
                        </TableCaption>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuestionsList;