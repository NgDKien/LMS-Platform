"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Table = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-md transition-all duration-500 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30">
                        {title}
                    </span>
                </div>

                <div className="flex-1 flex items-center gap-3 min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate flex-1">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const PersonalRoom = () => {
    const router = useRouter();
    const { user } = useUser();
    const client = useStreamVideoClient();

    const meetingId = user?.id;
    const { call } = useGetCallById(meetingId!);

    const startRoom = async () => {
        if (!client || !user) return;

        const newCall = client.call("default", meetingId!);

        if (!call) {
            await newCall.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                },
            });
        }

        router.push(`/zoom/meeting/${meetingId}?personal=true`);
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/zoom/meeting/${meetingId}?personal=true`;

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-4xl space-y-8 sm:space-y-10">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Personal Room</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                            Your Meeting Space
                        </h1>

                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                            Start instant meetings or share your personal room link with anyone
                        </p>
                    </div>

                    {/* Meeting Info Cards */}
                    <div className="space-y-4">
                        <Table
                            title="Topic"
                            description={`${user?.username}'s Meeting Room`}
                        />
                        <Table
                            title="Meeting ID"
                            description={meetingId!}
                        />
                        <Table
                            title="Invite Link"
                            description={meetingLink}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            className="group relative flex-1 h-14 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 border-0 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden"
                            onClick={startRoom}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                            <span className="relative flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Start Meeting
                            </span>
                        </Button>

                        <Button
                            className="group relative flex-1 h-14 text-base font-semibold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden backdrop-blur-sm"
                            onClick={() => {
                                navigator.clipboard.writeText(meetingLink);
                                toast.success('Link Copied');
                            }}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                            <span className="relative flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Invitation
                            </span>
                        </Button>
                    </div>

                    {/* Quick Tips */}
                    <div className=" flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>Instant access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            <span>Share with anyone</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            <span>Always available</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalRoom;