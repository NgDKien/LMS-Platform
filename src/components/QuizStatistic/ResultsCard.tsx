import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";

type Props = { accuracy: number };

const ResultsCard = ({ accuracy }: Props) => {
    const getResultConfig = (accuracy: number) => {
        if (accuracy >= 90) {
            return {
                trophy: "text-yellow-400",
                bgColor: "from-yellow-950/50 to-orange-950/50",
                borderColor: "border-yellow-800/50",
                textColor: "text-yellow-300",
                title: "Xuất sắc!",
                subtitle: "Thành tích vượt trội",
                bgIcon: "bg-yellow-900/50",
                shadowColor: "hover:shadow-yellow-500/10"
            };
        } else if (accuracy >= 75) {
            return {
                trophy: "text-yellow-400",
                bgColor: "from-yellow-950/50 to-amber-950/50",
                borderColor: "border-yellow-800/50",
                textColor: "text-yellow-300",
                title: "Ấn tượng!",
                subtitle: "Làm rất tốt",
                bgIcon: "bg-yellow-900/50",
                shadowColor: "hover:shadow-yellow-500/10"
            };
        } else if (accuracy >= 50) {
            return {
                trophy: "text-blue-400",
                bgColor: "from-blue-950/50 to-indigo-950/50",
                borderColor: "border-blue-800/50",
                textColor: "text-blue-300",
                title: "Tốt lắm!",
                subtitle: "Hoàn thành tốt",
                bgIcon: "bg-blue-900/50",
                shadowColor: "hover:shadow-blue-500/10"
            };
        } else if (accuracy >= 25) {
            return {
                trophy: "text-gray-400",
                bgColor: "from-gray-950/50 to-slate-950/50",
                borderColor: "border-gray-700/50",
                textColor: "text-gray-300",
                title: "Cố gắng lên!",
                subtitle: "Tiếp tục phát triển",
                bgIcon: "bg-gray-800/50",
                shadowColor: "hover:shadow-gray-500/10"
            };
        } else {
            return {
                trophy: "text-red-400",
                bgColor: "from-red-950/50 to-pink-950/50",
                borderColor: "border-red-800/50",
                textColor: "text-red-300",
                title: "Hãy luyện tập thêm!",
                subtitle: "Bạn có thể làm tốt hơn",
                bgIcon: "bg-red-900/50",
                shadowColor: "hover:shadow-red-500/10"
            };
        }
    };

    const config = getResultConfig(accuracy);

    return (
        <Card className={`md:col-span-4 bg-gradient-to-br ${config.bgColor} ${config.borderColor} hover:shadow-xl ${config.shadowColor} transition-all duration-300`}>
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-4 border-b ${config.borderColor}`}>
                <CardTitle className={`text-2xl font-bold ${config.textColor}`}>Kết quả</CardTitle>
                <div className={`p-2 ${config.bgIcon} rounded-full`}>
                    <Award className={config.trophy} size={24} />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <div className={`mb-4 p-6 ${config.bgIcon} rounded-full inline-block`}>
                        <Trophy className={config.trophy} size={56} />
                    </div>
                    <div className="space-y-3">
                        <h3 className={`text-4xl font-bold ${config.textColor}`}>
                            {config.title}
                        </h3>
                        <div className="space-y-1">
                            <p className={`text-lg font-medium ${config.textColor}`}>
                                {config.subtitle}
                            </p>
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${config.bgIcon} ${config.textColor} border ${config.borderColor}`}>
                                Độ chính xác {accuracy}%
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResultsCard;